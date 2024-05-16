import AvatarHover from "@/components/AvatarHover";
import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ToolBar from "@/components/ToolBar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Folder,
  Ghost,
  ImageIcon,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: {
    key: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();
  const userId = session?.user.id;
  const key = params.key;

  const photos = await db.photo.findMany({
    where: {
      Keyword: {
        some: {
          keyword: {
            contains: key,
          },
        },
      },
    },
  });

  if (photos.length === 0) {
    return (
      <>
        <MaxWidthWrapper>
          <div className="mt-40 flex flex-col items-center gap-2 h-screen">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>
              Sorry, we couldn't find any matches for{" "}
              <span className="text-green-600 font-medium">{params.key}</span>.
            </p>
          </div>
        </MaxWidthWrapper>
      </>
    );
  }

  return (
    <>
      <MaxWidthWrapper>
        <div className="my-10">
          <span className="text-4xl font-semibold">{key}</span>
        </div>
        {photos && photos.length !== 0 ? (
          <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 pb-40">
            {photos.map((photo) => (
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
                  <ToolBar photoId={photo.id} isOwn={userId ?? ""} />
                </div>

                <div className="flex items-center px-4 justify-between absolute bottom-4 w-full opacity-0 card__data">
                  <AvatarHover
                    userId={photo.userId ?? ""}
                    className="text-white"
                  />

                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <Button variant={"outline"} className="w-full" size={"lg"}>
          Load more
        </Button>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
