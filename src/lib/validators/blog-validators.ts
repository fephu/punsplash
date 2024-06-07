import { z } from "zod";

export const BlogValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  content: z.any(),
});

export type TBlogValidator = z.infer<typeof BlogValidator>;
