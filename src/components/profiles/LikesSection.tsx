"use client";

import { trpc } from "@/app/_trpc/client";
import {
  ArrowDown,
  Download,
  Ghost,
  Loader2,
  Maximize2,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import Skeleton from "react-loading-skeleton";
import { User } from "@prisma/client";
import ToolBar from "../ToolBar";
import AvatarHover from "../AvatarHover";
import { saveAs } from "file-saver";

interface LikesSectionProps {
  user: User | null;
  isOwn: string;
}

const LikesSection = ({ user, isOwn }: LikesSectionProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { data: photos, isLoading } =
    trpc.profileRouter.getUserLikesPhotos.useQuery({
      userId: user?.id ?? "",
    });

  const download = async (url: string, name: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();

      saveAs(blob, `${name}`);
    } catch (err) {
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {photos && photos.length !== 0 ? (
        <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 mt-8 pb-40">
          {photos.map((photo: any) => (
            <li
              key={photo.id}
              className="relative mb-4 card__article transition-all overflow-hidden break-inside-avoid group hover:brightness-95"
            >
              <Link href={`/photo/${photo.id}`} className="cursor-zoom-in">
                <Image
                  src={photo.url}
                  width={500}
                  height={500}
                  alt="Photo"
                  className="rounded-sm object-cover"
                />
              </Link>

              <div className="absolute opacity-0 card__data group-hover:opacity-1 top-4 right-4 flex items-center gap-4">
                <ToolBar photoId={photo.id} isOwn={isOwn} />
              </div>

              <div className="flex items-center px-4 justify-between absolute bottom-4 w-full opacity-0 card__data">
                <AvatarHover userId={photo.userId ?? ""} />

                <Button
                  onClick={() => download(photo.url, photo.name ?? "punsplash")}
                  variant={"outline"}
                  size={"sm"}
                  className="flex items-center gap-1"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-28 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s like your first photo.</p>
        </div>
      )}
    </>
  );
};

export default LikesSection;
