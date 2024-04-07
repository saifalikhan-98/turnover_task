import express from "express";

import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "./trpc"

import { signupHandler } from "./api/signup";
import { loginHandler } from "./api/signin";
import { fetchCategoriesHandler, populateCategories } from "./api/categories";
import { createUserCategory } from "./api/add_categories";
import { createContext } from "./context";

import * as trpcExpress from "@trpc/server/adapters/express";


const appRouter = router({
  healthCheck: publicProcedure.query(async () => {
    return {
      success: true,
      message: "hello from trpc",
    };
  }),
  signup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        // Add other required fields and validation here
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      return signupHandler(input);
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;
      return loginHandler(email, password);
    }),
  fetchCategories:protectedProcedure
    .input(
      z.object({
        page: z.number().nonnegative(),
        pageSize: z.number().nonnegative(),
      })
    )
    
    .mutation(async ({ input}) => {
      const { page, pageSize } = input;
      return fetchCategoriesHandler(page, pageSize);
    }),
  populateCategories: publicProcedure
    .input(z.object({}))
    .mutation(populateCategories),

  createUserCategory: publicProcedure
    .input(z.object({
        userId: z.number().nonnegative(),
        categoryIds: z.array(z.number()),
    }))
    .mutation(async ({ input}) => {
      const { userId,categoryIds} = input;
      return createUserCategory({userId,categoryIds});
    }),
 
});

const app = express();
const port = 8000;

// Add middleware for parsing JSON bodies
app.use(express.json());

// Add TRPC router to express app
app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter,createContext}));

// Define routes for other endpoints
app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

// Start the Express server
app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
