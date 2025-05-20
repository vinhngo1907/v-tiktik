import superjson from "superjson";
import { createRouter } from "./context";
import { videoRouter } from "./video";
import { followRouter } from "./follow";
import { likeRouter } from "./like";
import { commentRouter } from "./comment";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("video.", videoRouter)
    .merge("follow.", followRouter)
    .merge("like.", likeRouter)
    .merge("comment.", commentRouter);

export type AppRouter = typeof appRouter;