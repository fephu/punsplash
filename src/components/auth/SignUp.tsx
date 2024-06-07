import Link from "next/link";
import { Icons } from "../Icons";
import SignInAuthForm from "./SignInAuthForm";
import SignUpAuthForm from "./SignUpAuthForm";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center sm:w-[400px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <Icons.logo className="mx-auto h-8 w-8" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={"/sign-in"}
              className="hover:text-zinc-800 text-sm underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Sign in form */}
        <SignUpAuthForm />
      </div>
    </div>
  );
};

export default SignUp;
