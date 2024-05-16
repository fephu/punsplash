import Link from "next/link";

import { ChevronRight } from "lucide-react";
import { Collection } from "@prisma/client";
import { buttonVariants } from "../ui/button";
import CardCollectionsItem from "./CardCollectionsItem";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CardCollectionsProps {
  collections: Collection[] | null;
}

const CardCollections = ({ collections }: CardCollectionsProps) => {
  return (
    <Card className="w-[280px] h-[280px] bg-slate-50">
      <CardHeader className="pl-5 pr-0 py-2">
        <CardTitle className="text-base flex items-center justify-between">
          Collections{" "}
          <Link
            href={"/collections"}
            className={buttonVariants({
              variant: "link",
              className: "text-neutral-500",
            })}
          >
            See all
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-2 pt-0">
        {collections &&
          collections.map((collection: any) => (
            <CardCollectionsItem
              key={collection.id}
              collectionId={collection.id}
              title={collection.title}
              url={""}
              userId={collection.userId}
            />
          ))}
      </CardContent>
    </Card>
  );
};

export default CardCollections;
