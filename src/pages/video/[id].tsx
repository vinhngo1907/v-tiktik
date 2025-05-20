import Meta from "@/components/Shared/Meta";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "@/server/db/client";

const Video: NextPage<VideoProps> = ({ video, href, title }) => {

    if (!video) return <></>;

    return (
        <>
            <Meta
                title={`${video.user.name} on TopTop`}
                description="Video | TopTop"
                image={video.coverURL}
            />
        </>
    )
}

export default Video;

type VideoProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps = async ({
    params,
    req,
    res,
}: GetServerSidePropsContext) => {
    const session = (await getServerSession(req, res, authOptions)) as any;
    try {
        const id = params?.id as string;
        if (!id) throw new Error();

        const video = await prisma.video.findFirstOrThrow({
            where: { id },
            select: {
                id: true,
                videoURL: true,
                coverURL: true,
                caption: true,
                _count: { select: { likes: true } },
                user: { select: { id: true, image: true, name: true } },
                comments: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: { select: { id: true, image: true, name: true } },
                    }
                }
            }
        })

        let likedByMe = false;
        let followedByMe = false;

        if (session?.user?.id) {
            let [likeObj, followObj] = await Promise.all([
                prisma.like.findFirst({
                    where: {
                        userId: session?.user?.id,
                        videoId: video.id,
                    }
                }),
                prisma.follow.findFirst({
                    where: {
                        followerId: session.user.id,
                        followingId: video.user.id
                    },
                }),
            ]);

            likedByMe = Boolean(likeObj);
            followedByMe = Boolean(followObj);
        }

        return {
            props: {
                video: {
                    ...video,
                    likedByMe,
                    followedByMe
                },
                session,
                href: `${req.headers.host?.includes("localhost") ? "http" : "https"
                    }://${req.headers.host}/video/${id}`,
                title: `${video.user.name} on BuzzTime`,
            }
        }
    } catch (error) {
        return {
            props: {},
            notFound: true,
        };
    }
}