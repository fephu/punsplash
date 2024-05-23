"use client";

import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface AvatarHoverProps {
  userId: string;
  className?: string;
}

const AvatarHover = ({ userId, className }: AvatarHoverProps) => {
  const { data: user } = trpc.getUserById.useQuery({ userId });

  const { data: photos } = trpc.get3PhotosPopularOfUser.useQuery({ userId });

  if (user)
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-2 w-1/2">
            <Avatar className="relative w-9 h-9">
              {user.image ? (
                <div className="relative aspect-square h-full w-full">
                  <Image
                    src={user.image}
                    fill
                    alt="Profile Picture"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <AvatarFallback>
                  <span className="sr-only">{user.name}</span>
                  <Icons.user className="h-4 w-4 text-zinc-900" />
                </AvatarFallback>
              )}
            </Avatar>
            <span className={cn("text-white font-semibold text-sm", className)}>
              {user.name}
            </span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-96 h-64" side="top" align="start">
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2">
                <Avatar className="relative w-14 h-14">
                  {user.image ? (
                    <div className="relative aspect-square h-full w-full">
                      <Image
                        src={user.image}
                        fill
                        alt="Profile Picture"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <AvatarFallback>
                      <span className="sr-only">{user.name}</span>
                      <Icons.user className="h-4 w-4 text-zinc-900" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">{user.name}</span>
                  <span className="text-sm">@{user.username}</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-end gap-2 w-full h-full">
              {photos &&
                photos.map((photo: any) => (
                  <div key={photo.id} className="relative w-1/3 h-full">
                    <Image
                      src={photo.url}
                      fill
                      alt="3 photo of user"
                      className="absolute object-cover rounded-sm"
                    />
                  </div>
                ))}
            </div>
            <Link
              href={`/profile/${user.username}`}
              className={buttonVariants({ variant: "outline" })}
            >
              View profile
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
};

export default AvatarHover;
