import { FC, HTMLProps, useContext, useEffect, useRef, useState } from "react";
import { IoMdPause } from "react-icons/io";
import { VolumeContext } from "@/context/VolumeContext";
import { BsFillPlayCircleFill, BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";

const Video: FC<HTMLProps<HTMLVideoElement>> = (props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const { isMuted, setIsMuted } = useContext(VolumeContext);

    useEffect(() => {
        if (isPaused) {
            if (!videoRef?.current?.paused) {
                videoRef?.current?.pause();
            }
        } else {
            if (videoRef?.current?.paused) {
                videoRef?.current?.play();
            }
        }
    }, [isPaused]);

    return (
        <div className="h-full w-auto relative cursor-pointer">
            <video
                {...props}
                ref={videoRef} className="max-h-full w-auto"
                playsInline loop controls={false}
            />
            <button className="absolute bottom-4 left-3 z-10"
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setIsPaused(!isPaused)
                }}
            >
                {
                    isPaused ? (
                        <BsFillPlayCircleFill className="fill-white h-7 w-7" />
                    ) : (
                        <IoMdPause className="fill-white h-7 w-7" />
                    )
                }
            </button>
            <button
                className="absolute buttom-4 right-3 z-10"
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setIsMuted(!isMuted)
                }}
            >
                {
                    isMuted ? (
                        <BsFillVolumeMuteFill className="fill-white h-7 w-7" />
                    ) : (
                        <BsFillVolumeUpFill className="fill-white h-7 w-7" />
                    )
                }
            </button>
        </div>
    )
}

export default Video;