import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { prisma } from "@/server/db/client";
// import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        //   FacebookProvider({
        //     clientId: process.env.FACEBOOK_APP_ID!,
        //     clientSecret: process.env.FACEBOOK_APP_SECRET!,
        //   }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.uid;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                user.uid = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
        error: "/sign-in"
    }
}

export default NextAuth(authOptions);