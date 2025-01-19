// import { Follow, Like } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter } from "./context";
import { Follow, Like } from "@prisma/client";

export const videoRouter = createRouter()
    .query("video.for-you", {
        input: z.object({ cursor: z.number().nullish(), }),
        resolve: async ({ ctx: { prisma, session }, input }) => {
            const skip = input.cursor || 0;
            const items = await prisma.video.findMany({
                take: 10,
                skip,
                include: {
                    user: true,
                    _count: { select: { likes: true, comments: true } },
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            let likes: Like[] = [];
            let followings: Follow[] = [];
            if (session?.user?.id) {
                [likes, followings] = await Promise.all([
                    prisma.like.findMany({
                        where: {
                            userId: session?.user?.id,
                            videoId: { in: items.map((item: any) => item.id) },
                        },
                    }),
                    prisma.follow.findMany({
                        where: {
                            followerId: session.user.id,
                            followingId: {
                                in: items.map((item: any) => item.userId),
                            },
                        },
                    }),
                ]);
            }

            return {
                items: items.map((item: any) => ({
                    ...item,
                    likedByMe: likes.some(l => l.videoId === item.id),
                    followedByMe: followings.some(f => f.followingId === item.userId),
                })),
                nextSkip: items.length === 0 ? null : skip + 10,
            };
        },
    })
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw Error("");
        }
        return next();
    });