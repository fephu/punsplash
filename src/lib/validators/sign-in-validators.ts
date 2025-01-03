import { z } from "zod";

export const SignInValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, { message: "Password is not empty" })
    .max(20, { message: "Password less than 20 leters" }),
});

export type TSignInValidator = z.infer<typeof SignInValidator>;
