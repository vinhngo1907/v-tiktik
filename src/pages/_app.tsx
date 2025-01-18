import { AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

import type { AppRouter } from "@/server/router";
import { withTRPC } from "@trpc/next";
import SuperJSON from "superjson";

const MyApp: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <>
            {/* <Head><link rel="shortcut icon" href="/favicon.png" type="image/x-icon" /></Head>
            <Toaster /> */}
        </>
    )
}

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.browser) return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config() {
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: SuperJSON,
        };
    },
    ssr: false,
})(MyApp);