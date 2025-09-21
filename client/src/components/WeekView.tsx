import { useGetWeekSlots, type TimeSlot } from "@/hooks/useSlots";
import { cn } from "@/lib/utils";
import { addDays, isSameDay, isToday } from "date-fns";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";

const WeekView = ({
  weekStart,
  onOpenAddDialog,
  onOpenEditDialog,
  onCancelSlot,
}: {
  weekStart: Date;
  onOpenAddDialog: (date: Date) => void;
  onOpenEditDialog: (slot: TimeSlot) => void;
  onCancelSlot: (slot: TimeSlot) => void;
}) => {
  const { data: slots = [], isLoading } = useGetWeekSlots(weekStart);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getSlotsForDay = (date: Date): TimeSlot[] =>
    slots.filter((slot) => isSameDay(new Date(slot.date), date));

  const formatTo12Hour = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours, 10);
    const period = h >= 12 ? "PM" : "AM";
    const adjustedHour = h % 12 || 12;
    return `${adjustedHour}:${minutes} ${period}`;
  };

  const formatTimeSlot = (start_time: string, end_time: string) =>
    `${formatTo12Hour(start_time)} - ${formatTo12Hour(end_time)}`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg mb-8">
      <div className="p-4 bg-gray-50 rounded-t-lg">
        <h2 className="font-semibold text-gray-800 text-center">
          {format(weekStart, "MMMM yyyy")}
        </h2>
      </div>
      {weekDays.map((day, index) => {
        const daySlots = getSlotsForDay(day);
        const isCurrentDay = isToday(day);
        return (
          <div
            key={day.toString()}
            className={cn(
              "py-4 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start",
              index < weekDays.length - 1 ? "border-b border-gray-100" : ""
            )}
          >
            <div className="col-span-1">
              <div
                className={cn(
                  "font-semibold",
                  isCurrentDay ? "text-blue-600" : "text-gray-800"
                )}
              >
                {format(day, "EEEE, dd MMM")}
                {isCurrentDay && (
                  <span className="text-xs ml-2 text-gray-500 font-normal align-middle">
                    (Today)
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              {daySlots.length > 0 ? (
                daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="w-full flex items-center justify-between gap-2 bg-gray-50 rounded-lg p-2"
                  >
                    <div className="text-gray-800 text-sm font-medium flex-grow">
                      {formatTimeSlot(slot.start_time, slot.end_time)}
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenEditDialog(slot)}
                        className="h-8 w-8 text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onCancelSlot(slot)}
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-center text-gray-400 text-sm">
                  —
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAddDialog(day)}
                className="mt-1 w-full flex items-center justify-center gap-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="h-3 w-3" /> Add Recurring Slot
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
