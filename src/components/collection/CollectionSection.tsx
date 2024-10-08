"use client";

import { trpc } from "@/app/_trpc/client";
import { User } from "@prisma/client";
import { ArrowDown, Download, Forward, Ghost, Lock } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import CollectionsItem from "../profiles/CollectionsItem";
import AvatarHover from "../AvatarHover";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import EditPhoto from "../profiles/EditPhoto";
import ToolBar from "../ToolBar";
import { saveAs } from "file-saver";
import { useState } from "react";
import EditCollection from "./EditCollection";
import SharePopover from "../photo/SharePopover";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface CollectionSectionProps {
  collectionId: string;
  user: User | null;
  isOwn: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const CollectionSection = ({
  user,
  isOwn,
  collectionId,
  subscriptionPlan,
}: CollectionSectionProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { data: collection } = trpc.collectionRouter.getCollectionById.useQuery(
    {
      id: collectionId,
    },
    {
      staleTime: 1000 * 60 * 5, // 5 phút trước khi dữ liệu trở nên "stale"
      cacheTime: 1000 * 60 * 10, // 10 phút trước khi dữ liệu bị xóa khỏi cache
    }
  );

  const { data: photos, isLoading } =
    trpc.collectionRouter.getPhotoOfCollection.useQuery({
      id: collectionId,
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
      <div className="flex flex-col items-start md:items-center md:flex-row md:justify-between pb-10 gap-8 md:gap-6 mt-16 border-b border-gray-300">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-4xl font-semibold flex items-center gap-2">
            {collection?.isPrivate && <Lock className="w-6 h-6" />}
            {collection?.title}
          </span>
          {collection?.subtitle && (
            <span className="text-sm text-muted-foreground">
              {collection.subtitle}
            </span>
          )}
          <AvatarHover userId={user?.id ?? ""} className="text-black" />
        </div>

        {user?.id === isOwn ? (
          <EditCollection collection={collection} />
        ) : (
          <>
            <SharePopover />
          </>
        )}
      </div>

      <div className="flex flex-col">
        <span className="py-4 text-gray-600 font-semibold">
          {photos?.length} images
        </span>
        {photos && photos.length !== 0 ? (
          <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 pb-40">
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

                  {subscriptionPlan.isSubscribed || isOwn ? (
                    <Button
                      onClick={() => download(photo.url, "punsplash")}
                      variant={"outline"}
                      size={"sm"}
                      className="flex items-center gap-1"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Link
                      href={"/pricing"}
                      className={buttonVariants({ size: "sm" })}
                    >
                      <Lock className="w-4 h-4 mr-1.5" />
                      Download
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : isLoading ? (
          <Skeleton height={500} width={400} className="my-8 mx-2" inline />
        ) : (
          <div className="mt-28 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first photo.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionSection;
