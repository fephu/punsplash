"use client";

import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../Icons";

interface CardCollectionsItemProps {
  collectionId: string;
  title: string;
  url: string;
  userId: string;
}

const CardCollectionsItem = ({
  collectionId,
  title,
  url,
  userId,
}: CardCollectionsItemProps) => {
  const { data: photo } = trpc.collectionRouter.getThirdPhoto.useQuery({
    id: collectionId,
  });

  const { data: user } = trpc.getUserById.useQuery({ userId });

  return (
    <Link
      href={`/collection/${collectionId}`}
      className="flex items-center px-3 py-1.5 rounded-lg hover:bg-neutral-100"
    >
      {photo && (
        <Avatar className="w-8 h-8 rounded-md">
          {photo[0] && photo[0].url ? (
            <AvatarImage src={photo[0].url ?? ""} className="object-cover" />
          ) : (
            <AvatarFallback>
              <span className="sr-only">CN</span>
            </AvatarFallback>
          )}
        </Avatar>
      )}

      <div className="flex flex-col ml-2 overflow-hidden">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground text-xs">by {user?.name}</span>
      </div>
    </Link>
  );
};

export default CardCollectionsItem;
