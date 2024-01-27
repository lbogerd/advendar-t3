import { z } from "zod";

export const createCalendarSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character long",
  }),
  description: z.string().optional(),
});
