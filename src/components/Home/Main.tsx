import { FC, useEffect, useRef } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { InView } from "react-intersection-observer";
import VideoSection from "./VideoSection";

interface MainProps {
    origin: string
}

const Main: FC<MainProps> = ({ origin }) => {
    const router = useRouter();
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
        trpc.useInfiniteQuery(
            [
                Boolean(Number(router.query.following))
                    ? "video.following"
                    : "video.for-you",
                {},
            ],
            {
                getNextPageParam: (lastPage) => lastPage.nextSkip
            });

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!window.IntersectionObserver) return;
        if (observer.current) observer.current.disconnect();

    }, [data?.pages.length, Boolean(Number(router.query.following))]);

    if (data?.pages.length === 0 || data?.pages[0]?.items.length === 0) {
        return (
            <div className="flex-grow text-center my-4">There is no video yet</div>
        );
    }

    return (
        <div className="flex-grow">
            {
                data?.pages.map((page) => (
                    page.items.map(video => (
                        <VideoSection
                            video={video}
                            key={video.id}
                            refetch={refetch}
                            origin={origin}
                        />
                    ))
                ))
            }
            <InView
                fallbackInView onChange={(inView) => {
                    if (inView && !isFetchingNextPage && hasNextPage) {
                        fetchNextPage();
                    }
                }}
                rootMargin="0px 10px 1500px 0px"
            >
                {({ ref }) => <div ref={ref} className="h-10"></div>}
            </InView>
        </div>
    )
}

export default Main;