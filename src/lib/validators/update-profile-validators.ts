import { z } from "zod";

export const UpdateProfileValidators = z.object({
  name: z
    .string()
    .min(1, { message: "Name can not null" })
    .max(10, { message: "< 10 letters" }),
  username: z
    .string()
    .min(4, { message: "The username must be a least 4 characters long" })
    .max(10, { message: "The username must be a maximun 10 characters" })
    .includes(""),
  location: z.string(),
  bio: z
    .string()
    .refine((str) => str.length - (str.match(/\r\n/g) ?? []).length <= 200, {
      message: "Bio too long",
    }),
  portfolio: z.string(),
  insUsername: z.string(),
  xUsername: z.string(),
});

export type TUpdateProfileValidators = z.infer<typeof UpdateProfileValidators>;
