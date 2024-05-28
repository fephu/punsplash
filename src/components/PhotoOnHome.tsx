"use client";

import Image from "next/image";
import Link from "next/link";
import EditPhoto from "./profiles/EditPhoto";
import ToolBar from "./ToolBar";
import AvatarHover from "./AvatarHover";
import { Button, buttonVariants } from "./ui/button";
import { ArrowDown, Download, Ghost, Loader2, Lock } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { trpc } from "@/app/_trpc/client";
import { saveAs } from "file-saver";
import { useEffect, useRef, useState } from "react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { Photo } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/infinite";
import axios from "axios";
import { useIntersection } from "@mantine/hooks";

interface PhotoOnHomeProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
  isOwn: string;
  initialPhotos: Photo[];
}

const PhotoOnHome = ({
  isOwn,
  subscriptionPlan,
  initialPhotos,
}: PhotoOnHomeProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/photos?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;

      const { data } = await axios.get(query);

      return data;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPhotos], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

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

  const photos = data?.pages.flatMap((page) => page) ?? initialPhotos;

  return (
    <>
      {photos && photos.length !== 0 ? (
        <>
          <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 mt-20 pb-40">
            {photos.map((photo: any, index) => {
              if (index === photos.length - 1) {
                return (
                  <li
                    ref={ref}
                    key={photo.id}
                    className="relative mb-4 card__article transition-all overflow-hidden break-inside-avoid group hover:brightness-95"
                  >
                    <Link
                      href={`/photo/${photo.id}`}
                      className="cursor-zoom-in"
                    >
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
                      <AvatarHover
                        userId={photo.userId ?? ""}
                        className="text-white"
                      />

                      {subscriptionPlan.isSubscribed ? (
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
                );
              } else {
                return (
                  <li
                    key={photo.id}
                    className="relative mb-4 card__article transition-all overflow-hidden break-inside-avoid group hover:brightness-95"
                  >
                    <Link
                      href={`/photo/${photo.id}`}
                      className="cursor-zoom-in"
                    >
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
                      <AvatarHover
                        userId={photo.userId ?? ""}
                        className="text-white"
                      />

                      {subscriptionPlan.isSubscribed ? (
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
                );
              }
            })}
          </ul>
          {isFetchingNextPage && (
            <li className="flex justify-center">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </li>
          )}
        </>
      ) : (
        <div className="mt-28 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first photo.</p>
        </div>
      )}
    </>
  );
};

export default PhotoOnHome;
