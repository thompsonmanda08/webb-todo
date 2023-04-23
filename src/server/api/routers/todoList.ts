import { string, z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoListRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todoList.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  createOrUpdate: protectedProcedure
    .input(z.object({ name: string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todoList.upsert({
        where: {
          id: input.id,
        },
        update: {
          name: input.name,
        },
        create: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todoList.delete({
        where: {
          id: input.id,
        },
      });
    }),

  markDone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todoList.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
        },
      });
    }),

  markUnDone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todoList.update({
        where: {
          id: input.id,
        },
        data: {
          completed: false,
        },
      });
    }),
});
