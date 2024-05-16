"use client";

import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Icons } from "./Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { trpc } from "@/app/_trpc/client";

interface UserBoxProps {
  userId: string;
  image: string;
  name: string;
  username: string;
}

const UserBox = ({ userId, image, name, username }: UserBoxProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full border border-gray-200 p-4 bg-white rounded-md">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <Avatar className="relative w-14 h-14">
            {image ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  src={image}
                  fill
                  alt="Profile Picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="h-4 w-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-base">{name}</span>
            <span className="text-sm">@{username}</span>
          </div>
        </div>

        <Link
          href={`/profile/${username}`}
          className={buttonVariants({ variant: "outline" })}
        >
          View profile
        </Link>
      </div>
    </div>
  );
};

export default UserBox;
