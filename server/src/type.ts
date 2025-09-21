export interface Slot {
  id: number;
  day_of_week: number; // 0=Sunday ... 6=Saturday
  start_time: string;  // HH:MM:SS
  end_time: string;    // HH:MM:SS
  created_at?: string;
  updated_at?: string;
}

export interface SlotException {
  id: number;
  slot_id: number;
  date: string;        // YYYY-MM-DD
  start_time?: string;
  end_time?: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
}
