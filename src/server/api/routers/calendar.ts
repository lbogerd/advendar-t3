import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { calendars } from "~/server/db/schema";

export const calendarRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), description: z.string().optional() }),
    )
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
});
