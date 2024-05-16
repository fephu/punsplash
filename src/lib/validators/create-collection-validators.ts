import { z } from "zod";

export const CreateCollectionValidator = z.object({
  title: z.string().min(1, { message: "Title must not empty" }),
  subtitle: z.string(),
  isPrivate: z.boolean().default(true),
});

export type TCreateCollectionValidator = z.infer<
  typeof CreateCollectionValidator
>;
