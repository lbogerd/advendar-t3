import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import {
  addItemsSchema,
  createCalendarSchema,
  updateCalendarSchema,
} from "~/lib/validation";
import { calendarItems, calendars } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const calendarRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCalendarSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(calendars)
        .values({
          name: input.name,
          description: input.description,
          createdById: ctx.session.user.id,
        })
        .returning();
    }),

  update: protectedProcedure
    .input(updateCalendarSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(calendars)
        .set({
          name: input.name,
          description: input.description,
          shareable: input.shareable,
          updatedAt: new Date(),
        })
        .where(eq(calendars.id, input.calendarId))
        .returning();
    }),

  // TODO: split this into it's own router
  getPublic: publicProcedure
    .input(z.object({ calendarId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const calendar = await ctx.db.query.calendars.findFirst({
        where: and(
          eq(calendars.id, input.calendarId),
          or(
            eq(calendars.shareable, true),
            ctx.session?.user.id
              ? eq(calendars.createdById, ctx.session.user.id)
              : undefined,
          ),
        ),
        with: {
          items: true,
        },
      });

      if (!calendar) throw new TRPCError({ code: "NOT_FOUND" });

      return calendar;
    }),

  get: protectedProcedure
    .input(z.object({ calendarId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.calendars.findFirst({
        where: eq(calendars.id, input.calendarId),
        with: {
          items: true,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.calendars.findMany({
      where: eq(calendars.createdById, ctx.session.user.id),
    });
  }),

  addItems: protectedProcedure
    .input(addItemsSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(calendarItems)
        .values(
          input.items.map((item) => ({
            calendarId: input.calendarId,
            contentTitle: item.contentTitle,
            contentDescription: item.contentDescription,
            displayText: "",
            createdById: ctx.session.user.id,
          })),
        )
        .returning();
    }),
});
