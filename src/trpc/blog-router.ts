import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";

export const blogRouter = router({
  createBlog: privateProcedure
    .input(z.object({ title: z.string(), content: z.any() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { title, content } = input;

      await db.blog.create({
        data: {
          title,
          content,
          authorId: userId,
        },
      });

      return { success: true };
    }),
  getAllBlog: publicProcedure.query(async () => {
    const blogs = await db.blog.findMany();

    return blogs;
  }),
});

export type blogRouter = typeof blogRouter;
