import express from 'express';
import { 
  createSlot, 
  getWeekSlots, 
  updateSlotForDate, 
  deleteSlotForDate 
} from '../controller/slots';

const router = express.Router();

// Create a recurring slot
router.post('/', createSlot);

// Get slots for a specific week
router.get('/week', getWeekSlots);

// Update a slot for a specific date (create exception)
router.put('/:id', updateSlotForDate);

// Delete a slot for a specific date (create exception)
router.delete('/:id', deleteSlotForDate);

export default router;
