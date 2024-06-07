"use client";

import { trpc } from "@/app/_trpc/client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { Icons } from "../Icons";
import {
  BarChart2,
  Circle,
  CircleCheck,
  CircleX,
  Folder,
  Heart,
  ImageIcon,
  Locate,
  Mail,
  MapPin,
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { Button, buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";
import ConnectWith from "./ConnectWith";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useRouter } from "next/router";
import { useState } from "react";

interface ProfileProps {
  children: React.ReactNode;
  user: User | null;
  userId: string;
  isFollowed: number;
}

const Profile = ({ children, user, userId, isFollowed }: ProfileProps) => {
  const pathname = usePathname();

  const follow = async (email: string) => {
    try {
      await axios.post("/api/follow/add", {
        email,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return;
      }
      if (error instanceof AxiosError) {
        return;
      }
    }
  };

  const { data: countOfPhoto } = trpc.countPhoto.useQuery({
    userId: user?.id ?? "",
  });

  const { data: countOfLikesPhoto } = trpc.countLikesPhoto.useQuery({
    userId: user?.id ?? "",
  });

  const { data: countOfCollections } = trpc.countCollections.useQuery({
    userId: user?.id ?? "",
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-center pb-10 gap-4 mt-16">
        <Avatar className="relative w-40 h-40">
          {user?.image ? (
            <div className="relative aspect-square h-full w-full">
              <Image
                src={user?.image}
                fill
                alt="Profile Picture"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <AvatarFallback>
              <span className="sr-only">{user?.name}</span>
              <Icons.user className="h-20 w-20 text-zinc-900" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col items-start gap-2 px-0 md:px-2">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold mr-4">{user?.name}</span>
            {user?.id === userId ? (
              <Link
                href={"/account"}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Edit Profile
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {isFollowed === 0 && userId ? (
                  <Button size={"sm"} onClick={() => follow(user?.email ?? "")}>
                    Follow
                  </Button>
                ) : !userId ? (
                  <Link
                    href={"/sign-in"}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Follow
                  </Link>
                ) : (
                  <Button variant={"outline"} size={"sm"}>
                    Following
                  </Button>
                )}
                <Button variant={"outline"} size={"sm"}>
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            )}
            {user?.isHired && user.id !== userId && (
              <Button size={"sm"} variant={"outline"}>
                Hire
              </Button>
            )}
          </div>
          {user?.bio && <span className="my-2">{user?.bio}</span>}

          {user?.isHired && userId === user.id ? (
            <div className="flex items-center text-green-700">
              <CircleCheck className="w-4 h-4 mr-1.5" />
              Available for hire{" "}
              <Link
                href={"/account/hiring"}
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "underline",
                })}
              >
                Update
              </Link>
            </div>
          ) : !user?.isHired && userId === user?.id ? (
            <div className="flex items-center">
              <CircleX className="w-4 h-4 mr-1.5" />
              Not available for hire{" "}
              <Link
                href={"/account/hiring"}
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "underline",
                })}
              >
                Update
              </Link>
            </div>
          ) : null}

          {user?.location && (
            <Link href={"/"} className="flex items-center gap-2 mt-6">
              <MapPin className="w-4 h-4" />
              {user?.location}
            </Link>
          )}
          {(user?.insUsername || user?.portfolio || user?.xUsername) && (
            <ConnectWith
              username={user.username ?? ""}
              insUsername={user.insUsername ?? ""}
              xUsername={user.xUsername ?? ""}
              portfolio={user.portfolio ?? ""}
            />
          )}
        </div>
      </div>
      <div className="flex items-center w-full border-b border-gray-300">
        <Link
          href={`/profile/${user?.username}`}
          className={buttonVariants({
            variant: "ghost",
            className:
              pathname.includes(`/profile/${user?.username}/likes`) === false &&
              pathname.includes(`/profile/${user?.username}/collections`) ===
                false
                ? "border-b-2 border-gray-600 rounded-none"
                : "",
          })}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Images
          <span className="ml-1.5 hidden md:block">{countOfPhoto}</span>
        </Link>
        <Link
          href={`/profile/${user?.username}/likes`}
          className={buttonVariants({
            variant: "ghost",
            className: pathname.includes(`/profile/${user?.username}/likes`)
              ? "border-b-2 border-gray-600 rounded-none"
              : "",
          })}
        >
          <Heart className="w-4 h-4 mr-2" />
          Likes
          <span className="ml-1.5 hidden md:block">{countOfLikesPhoto}</span>
        </Link>
        <Link
          href={`/profile/${user?.username}/collections`}
          className={buttonVariants({
            variant: "ghost",
            className: pathname.includes(
              `/profile/${user?.username}/collections`
            )
              ? "border-b-2 border-gray-600 rounded-none"
              : "",
          })}
        >
          <Folder className="w-4 h-4 mr-2" />
          Collections
          <span className="ml-1.5 hidden md:block">{countOfCollections}</span>
        </Link>
      </div>
      {children}
    </>
  );
};

export default Profile;
