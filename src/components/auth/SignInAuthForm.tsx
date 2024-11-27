"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Icons } from "../Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  SignInValidator,
  TSignInValidator,
} from "@/lib/validators/sign-in-validators";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface SignInAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignInAuthForm = ({ className, ...props }: SignInAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TSignInValidator>({
    resolver: zodResolver(SignInValidator),
  });

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (err) {
      toast.error("Something went wrong. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    await signIn("credentials");
    toast.success("Ok");
  };

  return (
    <div className={cn("flex justify-center flex-col", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="username">Email</Label>
            <Input
              {...register("email")}
              id="username"
              className="col-span-2 h-8"
            />
            {errors?.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              className="col-span-2 h-8"
            />
            {errors?.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit">Sign in</Button>
        </div>
      </form>
      <Separator className="my-4" />
      <Button onClick={loginWithGoogle} size={"sm"} className="w-full">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Icons.google className="w-4 h-4 mr-2" />
        )}
        Google
      </Button>
    </div>
  );
};

export default SignInAuthForm;
