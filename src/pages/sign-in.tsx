import Navbar from "@/components/Layout/Navbar";
import Meta from "@/components/Shared/Meta";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const SignIn: NextPage = () => {
    const router = useRouter();
    const error = router.query.error as string;

    useEffect(() => {
        if (error) {

        }
    }, [error]);

    const handleSignIn = (provider: string) => {
        signIn(provider).catch((err: any) => {
            console.error(err);
            toast.error(`Unable to sign in with ${provider}`, {
                position: "bottom-right"
            });
        });
    }

    return (
        <>
            <Meta title="Log in | TopTop" description="Log in" image="/favicon.png" />
            <div className="min-h-screen flex flex-col items-stretch">
                <Navbar />
                <div className="flex-grow flex flex-col justify-center items-center gap-3">
                    <h1 className="text-3xl text-center font-semibold">
                        Log in to TikTok
                    </h1>
                    <p className="text-center w-[95vw] max-w-[375px] text-sm text-gray-500">
                        Manage your account, check notifications, comment on videos, and
                        more.
                    </p>
                    <button onClick={() => handleSignIn("goggle")}
                        className="w-[95vw] max-w-[375px] flex justify-center items-center relative border border-gray-200 hover:border-gray-400 transition h-11"
                    >
                        <span>Continue with Google</span>
                        <FcGoogle className="absolute top-1/2 -translate-y-1/2 left-3 w-6 h-6" />
                    </button>
                    <button onClick={() => handleSignIn("facebook")}
                        className="w-[95vw] max-w-[375px] flex justify-center items-center relative border border-gray-200 hover:border-gray-400 transition h-11"
                    >
                        <span>Continue with Google</span>
                        <BsFacebook className="absolute top-1/2 -translate-y-1/2 left-3 w-6 h-6 fill-[#0A80EC]" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SignIn;