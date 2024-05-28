import Link from "next/link";
import { Icons } from "../Icons";
import { buttonVariants } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

const Top = () => {
  return (
    <div className="h-1/2 w-full">
      <div className="px-0 md:px-8 py-6 w-full flex justify-between">
        <Link href={"/blog"} className="px-3">
          <Icons.logo className="w-10 h-10" />
        </Link>
        <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
          Home
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center mt-20 mb-40">
        <p className="text-7xl text-center font-bold">Punplash Blog</p>
        <p className="text-xl text-center my-4 text-muted-foreground">
          Stories from the community powering the internet&apos;s visuals.
        </p>
      </div>
    </div>
  );
};

export default Top;
