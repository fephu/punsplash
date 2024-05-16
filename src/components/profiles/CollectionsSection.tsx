"use client";

import { trpc } from "@/app/_trpc/client";
import { User } from "@prisma/client";
import { Ghost } from "lucide-react";
import CollectionsItem from "./CollectionsItem";
import Skeleton from "react-loading-skeleton";

interface CollectionsSectionProps {
  user: User | null;
  isOwn: boolean;
}

const CollectionsSection = ({ user, isOwn }: CollectionsSectionProps) => {
  const { data: allCollections, isLoading } =
    trpc.getAllCollectionsOfUser.useQuery({
      userId: user?.id ?? "",
    });

  const { data: countOfCollectionsPrivate } =
    trpc.countCollectionsPrivate.useQuery({
      userId: user?.id ?? "",
    });

  return (
    <>
      {!isOwn && (
        <div className="text-sm pt-8 flex items-end text-muted-foreground font-semibold">
          +{countOfCollectionsPrivate} private collections
        </div>
      )}
      {allCollections && allCollections.length !== 0 ? (
        <ul className="mt-8 pb-40 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {allCollections.map((collection: any) => {
            if (!collection.isPrivate || isOwn) {
              return (
                <CollectionsItem
                  key={collection.id}
                  id={collection.id}
                  title={collection.title}
                  subtitle={collection.subtitle}
                  userId={collection.userId}
                  isPrivate={collection.isPrivate}
                />
              );
            }
          })}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-28 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s create your first collection.</p>
        </div>
      )}
    </>
  );
};

export default CollectionsSection;
