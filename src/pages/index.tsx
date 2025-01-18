import Main from "@/components/Home/Main";
import Meta from "@/components/Shared/Meta";
import { InferGetServerSidePropsType, NextPage } from "next";

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;
export const getServerSideProps = async ({}) => {
    
}

const Home:NextPage<HomeProps> = ({
    origin
}) => {
    return (
        <>Home Page</>
    )
}

export default Home;