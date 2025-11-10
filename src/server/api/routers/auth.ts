import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@emalify/server/api/trpc";
import { env } from "@emalify/env";
import { createSession, deleteSession } from "@emalify/lib/auth";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input }) => {
      if (input.password !== env.ADMIN_PASSWORD) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const token = await createSession();
      return { success: true, token };
    }),

  logout: publicProcedure.mutation(async () => {
    await deleteSession();
    return { success: true };
  }),
});
