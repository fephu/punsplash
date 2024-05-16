"use client";

import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { Lock } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { buttonVariants } from "../ui/button";
import Image from "next/image";

interface CollectionsItemProps {
  id: string;
  title: string;
  subtitle?: string | null;
  userId: string;
  isPrivate?: boolean;
}

const CollectionsItem = ({
  id,
  title,
  subtitle,
  userId,
  isPrivate,
}: CollectionsItemProps) => {
  const { data: ownCollection } = trpc.getUserById.useQuery({
    userId,
  });

  const { data: photo } = trpc.collectionRouter.getThirdPhoto.useQuery({
    id,
  });

  const { data: countPhoto } = trpc.countPhotoOfCollection.useQuery({
    collectionId: id,
  });

  return (
    <li
      key={id}
      className="flex flex-col relative w-full h-full justify-between rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <Link href={`/collection/${id}`} className="relative">
        {photo ? (
          <div className="grid grid-cols-2 w-full grid-rows-2">
            {photo[0] ? (
              <div className="w-[220px] h-[100px] relative">
                <Image
                  src={photo[0].url ?? ""}
                  fill
                  alt="Avatar collection"
                  className="object-cover object-center rounded-tl-md"
                />
              </div>
            ) : (
              <Skeleton width={220} height={100} count={1} />
            )}
            {photo[1] ? (
              <div className="w-[220px] h-[200px] relative row-span-2">
                <Image
                  src={photo[1].url ?? ""}
                  fill
                  alt="Avatar collection"
                  className="object-cover object-center rounded-tr-md"
                />
              </div>
            ) : (
              <Skeleton width={220} height={100} count={1} />
            )}
            {photo[2] ? (
              <div className="w-[220px] h-[100px] relative row-span-2">
                <Image
                  src={photo[2].url ?? ""}
                  fill
                  alt="Avatar collection"
                  className="object-cover"
                />
              </div>
            ) : (
              <Skeleton width={220} height={100} count={1} />
            )}
          </div>
        ) : (
          <Skeleton width={220} height={100} count={1} />
        )}
      </Link>

      <span className="pt-4 pl-2 text-xl font-bold flex gap-2 items-center">
        {isPrivate ? <Lock className="h-5 w-5" /> : null}
        {title}
      </span>
      {subtitle !== "" && (
        <span className="pl-2 text-xs text-muted-foreground overflow-hidden">
          {subtitle}
        </span>
      )}
      <span className="pt-4 py-8 pl-2 text-sm text-muted-foreground">
        {countPhoto} photos - Curated by{" "}
        <Link
          href={`/profile/${ownCollection?.username}`}
          className={buttonVariants({
            variant: "link",
            size: "sm",
            className: "text-sm pl-0",
          })}
        >
          {ownCollection?.name}
        </Link>
      </span>
    </li>
  );
};

export default CollectionsItem;
