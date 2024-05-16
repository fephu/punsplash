import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UserBox from "@/components/UserBox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { Ghost } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: {
    key: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const key = params.key;

  const users = await db.user.findMany({
    where: {
      name: {
        contains: key,
      },
    },
  });

  if (users.length === 0) {
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
        {users.map((user: any) => (
          <UserBox
            key={user.id}
            userId={user.id}
            image={user.image ?? ""}
            name={user.name ?? ""}
            username={user.username ?? ""}
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
