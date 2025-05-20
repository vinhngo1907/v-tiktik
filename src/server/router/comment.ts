import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const commentRouter = createRouter()
    .query("by-video", {
        input: z.object({ videoID: z.string(), }),
        resolve: async ({ ctx: { prisma }, input }) => {
            const comments = await prisma.comment.findMany({
                where: {
                    videoId: input.videoID,
                },
                orderBy: { createdAt: "desc" },
                select: {
                    content: true,
                    id: true,
                    createdAt: true,
                    user: {
                        select: { id: true, name: true, image: true }
                    },
                },
            });
            return comments;
        }
    }).middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    }).mutation("post", {
        input: z.object({ videoId: z.string(), content: z.string().max(5000), }),
        resolve: async ({ ctx: { prisma, session }, input }) => {
            const created = await prisma.comment.create({
                data: {
                    content: input.content,
                    userId: session?.user?.id!,
                    videoId: input.videoId
                }
            });

            return created;
        }
    })