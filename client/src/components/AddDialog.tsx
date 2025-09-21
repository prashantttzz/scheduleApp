/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDays, format } from "date-fns";
import {
  DialogFooter,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddSlotDialog = ({
  isOpen,
  onClose,
  onSave,
  weeks,
  newAppointment,
  setNewAppointment,
}: any) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Recurring Slot</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="day-select">Day</Label>
          <Select
            value={newAppointment.date}
            onValueChange={(value) =>
              setNewAppointment((prev: any) => ({ ...prev, date: value }))
            }
          >
            <SelectTrigger id="day-select">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 7 }, (_, i) => addDays(weeks[0], i)).map(
                (day) => (
                  <SelectItem
                    key={format(day, "yyyy-MM-dd")}
                    value={format(day, "yyyy-MM-dd")}
                  >
                    {format(day, "EEEE, MMMM d, yyyy")}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={newAppointment.start_time}
              onChange={(e) =>
                setNewAppointment((prev: any) => ({
                  ...prev,
                  start_time: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={newAppointment.end_time}
              onChange={(e) =>
                setNewAppointment((prev: any) => ({
                  ...prev,
                  end_time: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={
            !newAppointment.date ||
            !newAppointment.start_time ||
            !newAppointment.end_time
          }
        >
          Add Slot
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
export default AddSlotDialog;
