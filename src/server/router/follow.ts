import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter } from "./context";

export const followRouter = createRouter();