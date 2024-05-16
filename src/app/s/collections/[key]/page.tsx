import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CollectionsItem from "@/components/profiles/CollectionsItem";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Ghost } from "lucide-react";

interface PageProps {
  params: {
    key: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const key = params.key;

  const collections = await db.collection.findMany({
    where: {
      title: {
        contains: key,
      },
    },
  });

  if (collections.length === 0) {
    return (
      <>
        <MaxWidthWrapper>
          <div className="mt-40 flex flex-col items-center gap-2 h-screen">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>
              Sorry, we couldn&apos;t find any matches for{" "}
              <span className="text-green-600 font-medium">{params.key}</span>.
            </p>
          </div>
        </MaxWidthWrapper>
      </>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="my-10">
        <span className="text-4xl font-semibold">{key}</span>
      </div>
      <ul className="pb-40 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection: any) => (
          <CollectionsItem
            key={collection.id}
            id={collection.id}
            title={collection.title}
            subtitle={collection.subtitle}
            userId={collection.userId}
          />
        ))}
      </ul>
      <Button variant={"outline"} className="w-full" size={"lg"}>
        Load more
      </Button>
    </MaxWidthWrapper>
  );
};

export default Page;
