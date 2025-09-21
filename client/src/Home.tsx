import { useState, useRef, useEffect, useCallback } from "react";
import { format, startOfWeek, addWeeks, isToday, addDays } from "date-fns";
import { Menu, Loader2 } from "lucide-react";
import {
  useCreateSlot,
  useUpdateSlotForDate,
  useDeleteSlotForDate,
  type TimeSlot,
} from "@/hooks/useSlots";
import AddSlotDialog from "./components/AddDialog";
import EditSlotDialog from "./components/EditDialog";
import WeekView from "./components/WeekView";
import { cn } from "./lib/utils";

const WeeklyCalendar = () => {
 const [weeks, setWeeks] = useState([startOfWeek(new Date(), { weekStartsOn: 0 })]);
  const [editDialog, setEditDialog] = useState<{ slot: TimeSlot | null; isOpen: boolean; }>({ slot: null, isOpen: false });
  const [editTimes, setEditTimes] = useState({ start_time: "", end_time: "" });
  const [addDialog, setAddDialog] = useState<{ isOpen: boolean; selectedDate?: Date; }>({ isOpen: false });
  const [newAppointment, setNewAppointment] = useState({ date: "", start_time: "", end_time: "" });
  const [shouldScroll, setShouldScroll] = useState(false);

  const createSlot = useCreateSlot();
  const updateSlot = useUpdateSlotForDate();
  const deleteSlot = useDeleteSlotForDate();
  const loaderRef = useRef<HTMLDivElement>(null);
  
  const currentWeekDays = Array.from({ length: 7 }, (_, i) => addDays(weeks[0], i));

  const loadMoreWeeks = useCallback(() => {
    setWeeks(prevWeeks => [...prevWeeks, addWeeks(prevWeeks[prevWeeks.length - 1], 1)]);
  }, []);

  const handleLoadNextWeekClick = () => {
    loadMoreWeeks();
    setShouldScroll(true);
  };
  
  useEffect(() => {
    if (shouldScroll && loaderRef.current) {
        // Find the last week element to scroll to
        const lastWeekElement = loaderRef.current.previousElementSibling;
        lastWeekElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        setShouldScroll(false); // Reset trigger
    }
  }, [weeks.length, shouldScroll]); // Depend on weeks.length to run after new week is added

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { loadMoreWeeks(); } },
      { threshold: 1.0 }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) { observer.observe(currentLoader); }
    return () => { if (currentLoader) { observer.unobserve(currentLoader); } };
  }, [loadMoreWeeks]);

  const openAddDialog = (selectedDate?: Date) => {
    setNewAppointment({ date: format(selectedDate || new Date(), "yyyy-MM-dd"), start_time: "", end_time: "" });
    setAddDialog({ isOpen: true, selectedDate });
  };

  const saveNewAppointment = () => {
    if (!newAppointment.date || !newAppointment.start_time || !newAppointment.end_time) return;
    createSlot.mutate({
      day_of_week: new Date(newAppointment.date).getUTCDay(),
      start_time: newAppointment.start_time,
      end_time: newAppointment.end_time,
    }, { onSuccess: () => setAddDialog({ isOpen: false }) });
  };

  const openEditDialog = (slot: TimeSlot) => {
    setEditTimes({ start_time: slot.start_time, end_time: slot.end_time });
    setEditDialog({ slot, isOpen: true });
  };
  
  const saveSlotEdit = () => {
    if (!editDialog.slot) return;
    updateSlot.mutate({
      slotId: editDialog.slot.id,
      date: editDialog.slot.date,
      start_time: editTimes.start_time,
      end_time: editTimes.end_time,
    }, { onSuccess: () => setEditDialog({ slot: null, isOpen: false }) });
  };

  const cancelSlot = (slot: TimeSlot) => {
    deleteSlot.mutate({ slotId: slot.id, date: slot.date });
  };
  
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between  mx-auto">
          <button className="p-2 rounded-md hover:bg-gray-100"><Menu className="h-5 w-5 text-gray-600" /></button>
          <h1 className="text-lg font-semibold text-gray-900">Your Schedule</h1>
        </div>
      </header>

      <div className="sticky top-[57px] z-10 bg-white/95 backdrop-blur-sm shadow-sm py-4">
        <div className=" mx-auto px-4">
             <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4">
              {currentWeekDays.map((day) => (
                <button
                  key={day.toString()}
                  onClick={() => openAddDialog(day)}
                  className={cn(
                    "flex flex-col items-center justify-center w-12 h-16 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
                    isToday(day)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="text-xs font-medium uppercase tracking-wider">{format(day, "EEE")}</span>
                  <span className="text-xl font-bold">{format(day, "d")}</span>
                </button>
              ))}
            </div>
             <div className="flex justify-center items-center gap-2">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600 border">Go to Current Week</button>
                <button onClick={handleLoadNextWeekClick} className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600 border">Load Next Week</button>
            </div>
        </div>
      </div>
      
      <main className="p-4  mx-auto">
        {weeks.map(weekStart => (
            <WeekView 
                key={weekStart.toString()} 
                weekStart={weekStart} 
                onOpenAddDialog={openAddDialog}
                onOpenEditDialog={openEditDialog}
                onCancelSlot={cancelSlot}
            />
        ))}

        <div ref={loaderRef} className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </main>
      <AddSlotDialog
        isOpen={addDialog.isOpen}
        onClose={() => setAddDialog({ isOpen: false })}
        onSave={saveNewAppointment}
        weeks={weeks}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
      />

      <EditSlotDialog
        isOpen={editDialog.isOpen}
        onClose={() => setEditDialog({ slot: null, isOpen: false })}
        onSave={saveSlotEdit}
        editTimes={editTimes}
        setEditTimes={setEditTimes}
      />
    </div>
  );
};

export default WeeklyCalendar;
