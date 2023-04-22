import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ todoListId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.todo.findMany({
        where: {
          todoListId: input.todoListId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        todoListId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          todoListId: input.todoListId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),
});
