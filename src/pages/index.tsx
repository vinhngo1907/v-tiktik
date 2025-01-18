import Main from "@/components/Home/Main";
import Meta from "@/components/Shared/Meta";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { prisma } from "@/server/db/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps = async ({ req, res, query }: GetServerSidePropsContext) => {
    const session = await getServerSession(req, res, authOptions);
    const isFetchingFollowing = Boolean(Number(query.following));
    if (isFetchingFollowing && !session?.user?.email) {
        return {
            redirect: {
                destination: "/sign-in",
                permanent: true,
            },
            props: {},
        }
    }
}

const Home: NextPage<HomeProps> = ({
    origin
}) => {
    return (
        <>Home Page</>
    )
}

export default Home;