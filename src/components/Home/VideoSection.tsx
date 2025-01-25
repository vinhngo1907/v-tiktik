import { trpc } from "@/utils/trpc";
import { User, Video } from "@prisma/client"
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";

interface VideoSectionProps {
    video: Video & {
        user: User;
        _count: {
            likes: number,
            comments: number
        };
        likedByMe: boolean;
        followeredByMe: boolean
    };
    origin: string;
    refetch: Function;
}
const VideoSection : FC<VideoSectionProps> = ({video, refetch, origin}) =>{
    const session = useSession();
    // const likeMution = trpc.useMutation("like.toggle");
    const followMution = trpc.useMutation("follow.toggle");

    const videoURL = `${origin}/video/${video.id}`;

    return (
        <div>Video Section</div>
    )
}

export default VideoSection;