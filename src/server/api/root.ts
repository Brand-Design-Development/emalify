import { leadRouter } from "@emalify/server/api/routers/lead";
import { authRouter } from "@emalify/server/api/routers/auth";
import { adminRouter } from "@emalify/server/api/routers/admin";
import {
  createCallerFactory,
  createTRPCRouter,
} from "@emalify/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  lead: leadRouter,
  auth: authRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
