import Navbar from "@/components/Layout/Navbar";
import Meta from "@/components/Shared/Meta";
import { fetchWithProgress } from "@/utils/fetch";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { DragEventHandler, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { Buffer } from "buffer";

const Upload: NextPage = () => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const uploadMutation = trpc.useMutation("video.create");

    const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const [inputValue, setInputValue] = useState<string | "">("");

    const [isLoading, setIsLoading] = useState(false);
    const [isFileDragging, setIsFileDragging] = useState(false);
    const [coverBlob, setCoverBlob] = useState<Blob | null>(null);


    useEffect(() => {
        if (uploadMutation.error) {
            toast.error("Failed to load the video", {
                position: "bottom-right",
            });
        }

    }, [uploadMutation.error])


    const handleFileChange = (file: File) => {
        if (!file.type.startsWith("video")) {
            toast("Only video file is allowed");
            return;
        }

        // Max 200MB file size
        if (file.size > 209715200) {
            toast("Max 200MB file size");
            return;
        }

        const url = URL.createObjectURL(file);

        setVideoFile(file);
        setVideoURL(url);

        const video = document.createElement("video");
        video.style.opacity = "0";
        video.style.width = "0px";
        video.style.height = "0px";

        document.body.appendChild(video);

        video.setAttribute("src", url);
        video.addEventListener("error", (error) => {
            console.log(error);
            document.body.removeChild(video);
            toast.error("Failed to load the video", {
                position: "bottom-right",
            });
        });

        video.addEventListener("loadeddata", () => {
            setTimeout(() => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")!;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                setVideoWidth(video.videoWidth);
                setVideoHeight(video.videoHeight);

                ctx.drawImage(video, 0, 0);
                setCoverImageURL(canvas.toDataURL("image/png"));

                document.body.removeChild(video);
            }, 300);
        });
        video.load();
    };

    function base64FromArrayBuffer(buffer?: ArrayBuffer) {
        if (!buffer) return '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        let binary = '';
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]!);
        }
        return window.btoa(binary);
    }

    const handleUploadFile = async () => {
        if (!coverImageURL || !videoFile || !videoURL || !inputValue.trim() || isLoading) return;

        setIsLoading(true);
        const toastID = toast.loading("Uploading...");

        try {
            // === 1. Upload video to MinIO ===
            const videoForm = new FormData();
            const videoName = `${Date.now()}-${videoFile.name}`;
            videoForm.append("file", videoFile, videoName);

            const videoRes = await fetch("/api/upload-to-minio", {
                method: "POST",
                body: videoForm,
            });

            if (!videoRes.ok) throw new Error("Failed to upload video");

            // const { url: videoURLFromMinio } = await videoRes.json();

            const resText = await videoRes.text();

            if (!videoRes.ok) {
                console.error("Upload failed:", resText);
                throw new Error("Failed to upload video");
            }

            const videoData = JSON.parse(resText);
            console.log("Upload video response:", videoData);

            const videoURLFromMinio = videoData.url;


            // === 2. Upload cover image ===
            const coverBlob = await fetch(coverImageURL).then((res) => res.blob());
            const coverForm = new FormData();
            const coverName = `${Date.now()}-cover.png`;
            coverForm.append("file", coverBlob, coverName);

            const coverRes = await fetch("/api/upload-to-minio", {
                method: "POST",
                body: coverForm,
            });

            if (!coverRes.ok) throw new Error("Failed to upload cover");

            const { url: coverURLFromMinio } = await coverRes.json();

            // === 3. Send metadata to server ===
            toast.loading("Saving metadata...", { id: toastID });

            const created = await uploadMutation.mutateAsync({
                caption: inputValue.trim(),
                videoURL: videoURLFromMinio,
                coverURL: coverURLFromMinio,
                videoHeight,
                videoWidth,
            });

            toast.dismiss(toastID);
            setIsLoading(false);
            router.push(`/video/${created.id}`);
        } catch (err:any) {
            console.error("Error: ", err.message);
            setIsLoading(false);
            toast.error("Failed to upload video", {
                position: "bottom-right",
                id: toastID,
            });
        }
    };

    const dropFile = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        let files = e.dataTransfer.files;

        if (files.length > 1) {
            toast("Only one file is allowed");
        } else {
            handleFileChange(files[0]);
        }

        setIsFileDragging(false);
    }

    const dragFocus: DragEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFileDragging(true);
    }

    const dragBlur: DragEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFileDragging(false);
    };

    return (
        <>
            <Meta title="Upload | TopTop" description="Upload" image="/favicon.png" />
            <div className="min-h-screen flex flex-col items-stretch">
                <Navbar />
                <div className="flex justify-center mx-2 flex-grow bg-gray-1">
                    <div className="w-full max-w-[1000px] p-8 bg-white my-4">
                        <BsFillCloudUploadFill className="fill-[#B0B0B4] w-10 h-10" />
                        <h1 className="text-2xl font-bold">Upload video</h1>
                        <p className="text-gray-400 mt-2">Post a video to your account</p>
                        <div className="flex items-start mt-10 gap-4">
                            {
                                videoURL ? (
                                    <video
                                        className="w-[250px] h-[340px] object-contain"
                                        muted
                                        autoPlay
                                        controls
                                        src={videoURL}
                                        playsInline
                                    />
                                ) : (
                                    <button
                                        onDrop={dropFile}
                                        onDragLeave={dragBlur}
                                        onDragEnter={dragFocus}
                                        onDragOver={dragFocus}
                                        onClick={() => inputRef.current?.click()}
                                        className={`w-[250px] flex-shrink-0 border-2 border-gray-300 rounded-md border-dashed flex flex-col items-center p-8 cursor-pointer hover:border-red-1 transition ${isFileDragging ? "border-red-1" : ""
                                            }`}
                                    >
                                        <h1 className="font-semibold mt-4 mb-2">
                                            Select video to upload
                                        </h1>
                                        <p className="text-gray-500 text-sm">
                                            Or drag and drop a file
                                        </p>

                                        <div className="flex flex-col items-center text-gray-400 my-4 gap-1 text-sm">
                                            <p>MP4 or WebM</p>
                                            <p>Any resolution</p>
                                            <p>Any duration</p>
                                            <p>Less than 200MB</p>
                                        </div>

                                        <div className="w-full bg-red-1 text-white p-2">
                                            Select file
                                        </div>
                                    </button>
                                )
                            }

                            <input
                                type="file" hidden className="hidden" accept="video/mp4,video/webm"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handleFileChange(e.target.files[0])
                                    }
                                }}
                            />
                            <div className="flex-grow">
                                <label className="block font-medium" htmlFor="caption">
                                    Caption
                                </label>
                                <input
                                    id="caption"
                                    type="text" value={inputValue} onChange={(e) => {
                                        if (!isLoading) setInputValue(e.target.value);
                                    }}
                                    className="p-2 w-full border border-gray-2 mt-1 mb-3 outline-none focus:border-gray-400 transition"
                                />
                                <p className="font-medium">Cover</p>
                                <div className="p-2 border border-gray-2 h-[170px] mb-2">
                                    {coverImageURL ? (
                                        <img
                                            className="h-full w-auto object-contain"
                                            src={coverImageURL}
                                            alt=""
                                        />
                                    ) : (
                                        <div className="bg-gray-1 h-full w-[100px]"></div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        disabled={isLoading}
                                        onClick={() => {
                                            if (inputRef.current?.value) inputRef.current.value = "";

                                            setCoverImageURL(null);
                                            setInputValue("");
                                            setVideoFile(null);
                                            setVideoURL(null);

                                        }}
                                        className="py-3 min-w-[170px] border border-gray-2 bg-white hover:bg-gray-100 transition"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        onClick={() => handleUploadFile()}
                                        disabled={
                                            !inputValue.trim() ||
                                            !videoURL ||
                                            !videoFile ||
                                            !coverImageURL ||
                                            isLoading
                                        }
                                        className={`flex justify-center items-center gap-2 py-3 min-w-[170px] hover:brightness-90 transition text-white bg-red-1 disabled:text-gray-400 disabled:bg-gray-200`}
                                    >
                                        {isLoading && (
                                            <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                                        )}
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Upload;