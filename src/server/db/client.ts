// import { PrismaClient } from "@prisma/client";

// declare global {
//     var prisma: PrismaClient | undefined;
// }

// export const prisma =
//     global.prisma ||
//     new PrismaClient({
//         // log: ["query"],
//     });

// if (process.env.NODE_ENV !== "production") {
//     global.prisma = prisma;
// }

import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = () => {
    return new PrismaClient();
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;