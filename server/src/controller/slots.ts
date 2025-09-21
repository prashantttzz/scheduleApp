import { Request, Response } from "express";
import db from "../db";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Slot, SlotException } from "../type";

export const createSlot = async (req: Request, res: Response) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    if (day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({ error: "invalid day of week" });
    }
    const existingSlot = await db("slots")
      .where({ day_of_week })
      .count("* as count")
      .first();
    if (existingSlot && Number(existingSlot.count) >= 2) {
      return res
        .status(400)
        .json({ error: "cannot create more than 2 slot for this day" });
    }
    const [slot] = await db("slots")
      .insert({ day_of_week, start_time, end_time })
      .returning("*");
    res.json(slot);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "failed to create slot" });
  }
};

export const getWeekSlots = async (req: Request, res: Response) => {
  try {
    const startDateStr = req.query.start as string;
    if (!startDateStr)
      return res.status(400).json({ error: "start date required" });

    const weekStart = startOfWeek(new Date(startDateStr), { weekStartsOn: 0 });
    const weekDates = Array.from({ length: 7 }, (_, i) =>
      addDays(weekStart, i)
    );
    const recurringSlots: Slot[] = await db("slots").select("*");
    
    // Robustly fetch exceptions by casting the 'date' column to a DATE type, ignoring time.
    const dateStrings = weekDates.map((d) => format(d, "yyyy-MM-dd"));
    const placeholders = dateStrings.map(() => '?').join(',');
    const exceptions: SlotException[] = await db("slot_exceptions")
      .whereRaw(`CAST(date AS DATE) IN (${placeholders})`, dateStrings)
      .select("*");

    const result: Record<string, any[]> = {};
    weekDates.forEach((date) => {
      const day = date.getDay();
      const daySlots = recurringSlots
        .filter((s) => s.day_of_week === day)
        .map((s) => ({ ...s, date: format(date, "yyyy-MM-dd") }));
      
      // Robustly filter exceptions in-memory by comparing only the date part.
      const exceptionsForDay = exceptions.filter(
        (e) => isSameDay(new Date(e.date), date)
      );

      const finalSlots = daySlots
        .map((s) => {
          const exception = exceptionsForDay.find((e) => e.slot_id === s.id);
          if (exception) {
            if (exception.is_deleted) return null;
            return {
              ...s,
              start_time: exception.start_time,
              end_time: exception.end_time,
            };
          }
          return s;
        })
        .filter(Boolean);
        
      result[format(date, "yyyy-MM-dd")] = finalSlots;
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch week slots" });
  }
};

export const updateSlotForDate = async (req: Request, res: Response) => {
  try {
    const slotId = parseInt(req.params.id);
    const { date, start_time, end_time } = req.body;

    if (!date) return res.status(400).json({ error: "date is required" });

    // Robustly find existing exception by casting date
    const [existing] = await db("slot_exceptions")
      .where({ slot_id: slotId })
      .whereRaw('CAST(date AS DATE) = ?', [date])
      .select("id");

    if (existing) {
      const [updated] = await db("slot_exceptions")
        .where({ id: existing.id })
        .update({
          start_time,
          end_time,
          is_deleted: false,
          updated_at: db.fn.now(),
        })
        .returning("*");
      return res.json(updated);
    }

    const [exception] = await db("slot_exceptions")
      .insert({
        slot_id: slotId,
        date,
        start_time,
        end_time,
        is_deleted: false,
      })
      .returning("*");

    res.json(exception);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update slot for date" });
  }
};


export const deleteSlotForDate = async (req: Request, res: Response) => {
  try {
    const slotId = parseInt(req.params.id);
    const { date } = req.query; // Use query parameter as sent by the frontend

    if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: "A valid 'date' query parameter is required" });
    }
    
    // Robustly find existing exception by casting date
    const [existing] = await db("slot_exceptions")
      .where({ slot_id: slotId })
      .whereRaw('CAST(date AS DATE) = ?', [date])
      .select("id");
    
    if (existing) {
      const [updated] = await db("slot_exceptions")
        .where({ id: existing.id })
        .update({ is_deleted: true, updated_at: db.fn.now() })
        .returning("*");
      return res.json(updated);
    }
    
    const [exception] = await db("slot_exceptions")
      .insert({ slot_id: slotId, date, is_deleted: true })
      .returning("*");
    res.json(exception);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete slot for date" });
  }
};

