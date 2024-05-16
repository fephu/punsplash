import { z } from "zod";

export const SignInValidator = z.object({
  username: z
    .string()
    .min(1, { message: "Username is not empty" })
    .max(20, { message: "Username less than 20 leters" }),
  password: z
    .string()
    .min(1, { message: "Password is not empty" })
    .max(10, { message: "Password less than 20 leters" }),
});

export type TSignInValidator = z.infer<typeof SignInValidator>;
