import React from "react";
import { Icons } from "../Icons";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

const Description = () => {
  return (
    <>
      <div className="px-8 py-6 w-full flex justify-between">
        <Link href={"/blog"}>
          <Icons.logo className="w-10 h-10" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
            Home
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href={"/blog/create"}
            className={buttonVariants({ variant: "outline" })}
          >
            Create
          </Link>
        </div>
      </div>
      <div className="flex justify-center mt-20 mb-40">
        <p className="text-[7.5vw] uppercase text-center max-w-[50vw] leading-none">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </>
  );
};

export default Description;
