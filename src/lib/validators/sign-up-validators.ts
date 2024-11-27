import { z } from "zod";

export const SignUpValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(1, { message: "Password is not empty" })
    .max(20, { message: "Password less than 20 leters" }),
});

export type TSignUpValidator = z.infer<typeof SignUpValidator>;
