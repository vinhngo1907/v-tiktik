import superjson from "superjson";
import { createRouter } from "./context";
import { videoRouter } from "./video";
import { followRouter } from "./follow";
import { likeRouter } from "./like";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("video.", videoRouter)
    .merge("follow.", followRouter)
    .merge("like.",likeRouter);

export type AppRouter = typeof appRouter;