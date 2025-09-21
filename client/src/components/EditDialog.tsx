/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const EditSlotDialog = ({
  isOpen,
  onClose,
  onSave,
  editTimes,
  setEditTimes,
}: any) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Appointment Exception</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-start-time">Start Time</Label>
            <Input
              id="edit-start-time"
              type="time"
              value={editTimes.start_time}
              onChange={(e) =>
                setEditTimes((prev: any) => ({
                  ...prev,
                  start_time: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-end-time">End Time</Label>
            <Input
              id="edit-end-time"
              type="time"
              value={editTimes.end_time}
              onChange={(e) =>
                setEditTimes((prev: any) => ({
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
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default EditSlotDialog;
