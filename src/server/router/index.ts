import superjson from "superjson";
import { createRouter } from "./context";
import { videoRouter } from "./video";
import { followRouter } from "./follow";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("video.", videoRouter)
    .merge("follow.", followRouter);

export type AppRouter = typeof appRouter;