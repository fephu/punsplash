"use client";

import { trpc } from "@/app/_trpc/client";
import CollectionsItem from "../profiles/CollectionsItem";

interface CollectionsProps {
  userId: string;
}

const Collections = ({ userId }: CollectionsProps) => {
  const utils = trpc.useContext();

  const { data: allCollections } =
    trpc.collectionRouter.getAllCollections.useQuery();

  return (
    <>
      <div className="mt-16 flex flex-col items-start justify-between sm:flex-row sm:items-center gap-4 sm:gap-0 border-b border-gray-200 pb-16">
        <div className="flex flex-col">
          <h1 className="mb-3 font-bold text-4xl text-gray-900">Collections</h1>
          <span className="text-sm text-foreground">
            Explore the world through collections of beautiful photos free to
            use under the
          </span>
        </div>
      </div>

      {allCollections && allCollections.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {allCollections.map((collection: any) => (
            <CollectionsItem
              key={collection.id}
              id={collection.id}
              title={collection.title}
              subtitle={collection.subtitle}
              userId={collection.userId}
            />
          ))}
        </ul>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Collections;
