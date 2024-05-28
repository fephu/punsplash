import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between px-10 pt-10">
        <Link href={"/blog"}>
          <Icons.logo className="w-10 h-10" />
        </Link>
        <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
          Home
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-8 items-center mt-10 mb-40">
        <div className="text-lg flex items-center gap-2 p-4">
          <span>Tuan Phu</span>{" "}
          <span className="text-muted-foreground text-base">
            {format(Date.now(), "dd/MM/yyyy")}
          </span>
        </div>
        <div className="flex flex-col gap-8 text-center">
          <span className="text-5xl font-bold">6 Million Images</span>
          <span className="text-xl text-muted-foreground">
            Every image tells a story
          </span>
        </div>

        <div className="relative w-full h-[40rem] mt-20">
          <Image src={"/images/6-2-2.gif"} fill alt="card image" />
        </div>
      </div>
    </div>
  );
};

export default Page;
