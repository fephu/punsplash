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
  MapPin,
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { Button, buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

interface ProfileProps {
  children: React.ReactNode;
  user: User | null;
  userId: string;
}

const Profile = ({ children, user, userId }: ProfileProps) => {
  const router = useRouter();

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
        <div className="flex flex-col gap-2 px-0 md:px-2">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold mr-4">{user?.name}</span>
            {user?.isHired && user.id !== userId && (
              <Button size={"sm"}>Hire</Button>
            )}
            {user?.id === userId && (
              <Link
                href={"/account"}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Edit Profile
              </Link>
            )}
          </div>
          {user?.bio && <span className="my-4">{user?.bio}</span>}

          {user?.isHired ? (
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
          ) : (
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
          )}

          {user?.location && (
            <Link
              href={"/"}
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <MapPin className="w-4 h-4" />
              {user?.location}
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center w-full border-b border-gray-300">
        <Link
          href={`/profile/${user?.username}`}
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Images
          <span className="ml-1.5">{countOfPhoto}</span>
        </Link>
        <Link
          href={`/profile/${user?.username}/likes`}
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <Heart className="w-4 h-4 mr-2" />
          Likes
          <span className="ml-1.5">{countOfLikesPhoto}</span>
        </Link>
        <Link
          href={`/profile/${user?.username}/collections`}
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <Folder className="w-4 h-4 mr-2" />
          Collections
          <span className="ml-1.5">{countOfCollections}</span>
        </Link>
        <Link
          href={`/profile/${user?.username}/stats`}
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          Stats
        </Link>
      </div>
      {children}
    </>
  );
};

export default Profile;
