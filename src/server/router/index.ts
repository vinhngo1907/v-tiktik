import superjson from "superjson";
import { createRouter } from "./context";
import { videoRouter } from "./video";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("video.", videoRouter);

export type AppRouter = typeof appRouter;