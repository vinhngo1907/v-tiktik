import { FC, useRef } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

interface MainProps {
    origin: string
}

const Main: FC<MainProps> = ({ origin }) => {
    const router = useRouter();
    // const {data} = trpc.useInfiniteQuery([
    //     // Boolean(Number(router.query.following))
    // ])

    const observer = useRef<IntersectionObserver | null>(null);
    return (
        <div className="flex-grow">Home Main Page</div>
    )
}

export default Main;