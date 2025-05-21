import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { Follow, Like } from "@prisma/client";

export const videoRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    })
    .query("for-you", {
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
    .query("following", {
        input: z.object({
            cursor: z.number().nullish(),
        }),
        resolve: async ({ ctx: { prisma, session }, input }) => {
            const followingIds = (
                await prisma.follow.findMany({
                    where: {
                        followerId: session?.user?.id!,
                    },
                    select: {
                        followingId: true,
                    },
                })
            ).map(f => f.followingId);

            const skip = input.cursor || 0;
            const videos = await prisma.video.findMany({
                take: 10,
                skip,
                where: {
                    userId: { in: followingIds },
                },
                include: {
                    user: true,
                    _count: { select: { likes: true, comments: true } },
                },
                orderBy: {
                    createdAt: "desc"
                },
            });

            let likes: Like[] = [];
            let followings: Follow[] = [];
            [likes, followings] = await Promise.all([
                prisma.like.findMany({
                    where: {
                        userId: session?.user?.id!,
                        videoId: { in: videos.map(v => v.id) }
                    },
                }),
                prisma.follow.findMany({
                    where: {
                        followerId: session?.user?.id!,
                        followingId: { in: videos.map(v => v.userId) }
                    }
                })
            ]);

            return {
                items: videos.map(v => ({
                    ...v,
                    likedByMe: likes.some(l => l.videoId === v.id),
                    followedByMe: followingIds.some(f => f === v.userId)
                })),
                nextSkip: videos.length === 0 ? null : skip + 1,
            };
        },
    })

    .mutation("create", {
        input: z.object({
            caption: z.string(),
            videoURL: z.string(),
            coverURL: z.string(),
            videoWidth: z.number().gt(0),
            videoHeight: z.number().gt(0),
        }),
        resolve: async ({ ctx: { prisma, session }, input }) => {
            const createdVideo = await prisma.video.create({
                data: {
                    caption: input.caption,
                    videoURL: input.videoURL,
                    coverURL: input.coverURL,
                    videoHeight: input.videoHeight,
                    videoWidth: input.videoWidth,
                    userId: session?.user?.id!,
                }
            });

            return createdVideo;
        },
    });
