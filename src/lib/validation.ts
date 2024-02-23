import { z } from "zod";

export const createCalendarSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a valid name.",
  }),
  description: z.string().optional(),
});

export const itemSchema = z.object({
  contentTitle: z.string().min(1),
  contentDescription: z.string().min(1),
  displayText: z.string().min(1),
});

export const addItemsSchema = z.object({
  calendarId: z.string().uuid(),
  items: z.array(itemSchema),
});

export const updateCalendarSchema = z
  .object({
    calendarId: z.string().uuid(),
    shareable: z.boolean(),
  })
  .merge(createCalendarSchema);
