/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import axios from "axios";
const backend_url = "https://scheduleapp-6kyo.onrender.com";

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  date: string;
  day_of_week: number;
  isException?: boolean;
}

export const useGetWeekSlots = (weekStart: Date) => {
  return useQuery({
    queryKey: ["slots", format(weekStart, "yyyy-MM-dd")],
    queryFn: async () => {
      const res = await axios.get(
        `${backend_url}/slots/week?start=${format(weekStart, "yyyy-MM-dd")}`
      );
      const slots: TimeSlot[] = [];
      Object.entries(res.data).forEach(([date, daySlots]: any) => {
        (daySlots as TimeSlot[]).forEach((s: TimeSlot) => {
          slots.push({ ...s, date });
        });
      });
      return slots;
    },
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });
};

export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: {
      day_of_week: number;
      start_time: string;
      end_time: string;
    }) => {
      const res = await axios.post(`${backend_url}/slots`, slot);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useUpdateSlotForDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      slotId: string;
      date: string;
      start_time?: string;
      end_time?: string;
    }) => {
      await axios.put(`${backend_url}/slots/${data.slotId}`, {
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useDeleteSlotForDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      slotId: string;
      date: string;
    }) => {
      await axios.delete(`${backend_url}/slots/${data.slotId}?date=${data.date}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};
