import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { calendarItems, calendars } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { createCalendarSchema } from "~/lib/validation";

export const calendarRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCalendarSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(calendars)
        .values({
          name: input.name,
          descripton: input.description,
          createdById: ctx.session.user.id,
        })
        .returning();
    }),
  get: protectedProcedure
    .input(z.object({ calendarId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.calendars.findFirst({
        where: eq(calendars.id, input.calendarId),
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.calendars.findMany({
      where: eq(calendars.createdById, ctx.session.user.id),
    });
  }),
  addItems: protectedProcedure
    .input(
      z.object({
        calendarId: z.string().uuid(),
        items: z.array(
          z.object({
            contentTitle: z.string().min(1),
            contentDescription: z.string().min(1),
            displayText: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(calendarItems)
        .values(
          input.items.map((item) => ({
            calendarId: input.calendarId,
            contentTitle: item.contentTitle,
            contentDescription: item.contentDescription,
            displayText: item.displayText,
            createdById: ctx.session.user.id,
          })),
        )
        .returning();
    }),
});
