"use client";

import { Feature } from "@prisma/client";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";
import ToolBar from "../ToolBar";
import AvatarHover from "../AvatarHover";
import { Button } from "../ui/button";
import { Download, Ghost } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { saveAs } from "file-saver";
import { useState } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";

interface FeatureSectionProps {
  feature: Feature | null;
  isOwn: string;
}

const FeatureSection = ({ feature, isOwn }: FeatureSectionProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { data: photos, isLoading } =
    trpc.featureRouter.getAllPhotoByFeature.useQuery({
      id: feature?.id ?? "",
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
      <div className="w-full h-full relative pt-14">
        <AspectRatio ratio={16 / 8}>
          <Image
            src={feature?.imageUrl ?? ""}
            alt="Photo Featured"
            fill
            className="object-cover opacity-90"
          />
        </AspectRatio>
        <div className="absolute top-1/3 px-8 md:pl-20 bottom-0 z-20 w-full md:w-1/2">
          {feature?.name ? (
            <h1 className="font-bold text-white text-4xl md:text-6xl">
              {feature.name}
            </h1>
          ) : null}
          {feature?.subtitle ? (
            <p className="mt-2 text-xs md:text-xl font-light text-white">
              {feature.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <MaxWidthWrapper>
        {photos && photos.length !== 0 ? (
          <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 mt-20 pb-40">
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
                  <ToolBar photoId={photo.id} isOwn={isOwn} />
                </div>

                <div className="flex items-center px-4 justify-between absolute bottom-4 w-full opacity-0 card__data">
                  <AvatarHover userId={photo.userId ?? ""} />

                  <Button
                    onClick={() => download(photo.url, "punsplash")}
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
        ) : isLoading ? (
          <Skeleton height={500} width={400} className="my-8 mx-2" inline />
        ) : (
          <div className="mt-28 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first photo.</p>
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
};

export default FeatureSection;
