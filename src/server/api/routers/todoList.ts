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

  create: protectedProcedure
    .input(z.object({ name: string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todoList.create({
        data: {
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todoList.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
