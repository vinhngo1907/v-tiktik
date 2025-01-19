import Navbar from "@/components/Layout/Navbar";
import Meta from "@/components/Shared/Meta";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignIn: NextPage = () => {
    const router = useRouter();
    const error = router.query.error as string;

    useEffect(() => {
        if(error){

        }
    },[error]);

    return (
        <>
        <Meta title="Log in | TopTop" description="Log in" image="/favicon.png" />
        <div className="min-h-screen flex flex-col items-stretch">
            <Navbar/>
        </div>
        </>
    )
}

export default SignIn;