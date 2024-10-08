"use client";

import { trpc } from "@/app/_trpc/client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  Calendar,
  Camera,
  ChevronDown,
  Download,
  Ellipsis,
  Forward,
  Ghost,
  Loader2,
  Lock,
  MapPin,
  Share,
  ShieldCheck,
} from "lucide-react";
import AvatarHover from "../AvatarHover";
import ToolBar from "../ToolBar";
import { Button, buttonVariants } from "../ui/button";
import SharePopover from "./SharePopover";
import Skeleton from "react-loading-skeleton";
import { saveAs } from "file-saver";
import { useState } from "react";
import { Icons } from "../Icons";
import { format, formatDate, formatDistance, subDays } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ReportDialog from "./ReportDialog";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { notFound } from "next/navigation";

interface PhotoDialogProps {
  photoId: string;
  isOwn: string;
  photoUrl: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
  photoUserId: string;
  photoStatsView: number;
  photoStatsDownload: number;
  photoDescription: string;
  photoCity: string;
  photoCountry: string;
  photoCreatedAt: Date;
  photoCameraMake: string;
  photoCameraModel: string;
  photoFL: number;
  photoAV: number;
  photoET: string;
  photoISO: number;
  photoW: number;
  photoH: number;
}

const PhotoDialog = ({
  photoId,
  isOwn,
  subscriptionPlan,
  photoUrl,
  photoUserId,
  photoStatsView,
  photoStatsDownload,
  photoDescription,
  photoCity,
  photoCountry,
  photoCreatedAt,
  photoCameraMake,
  photoCameraModel,
  photoFL,
  photoAV,
  photoET,
  photoISO,
  photoW,
  photoH,
}: PhotoDialogProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { data: tags } = trpc.photoRouter.getAllTagsOfPhoto.useQuery({
    id: photoId,
  });

  const { mutate: incrDownload } = trpc.incrDownload.useMutation({});

  const { data: photos, isLoading } =
    trpc.photoRouter.get20PhotoRelated.useQuery();

  const download = async (url: string, name: string, photoId: string) => {
    try {
      setIsDownloading(true);
      incrDownload({ photoId });
      const response = await fetch(url);
      const blob = await response.blob();

      saveAs(blob, `${name}`);
    } catch (err) {
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex relative flex-col items-center w-full h-full">
      <div className="flex sticky top-0 h-16 bg-white items-center justify-between w-full">
        <AvatarHover className="text-black" userId={photoUserId ?? ""} />
        <div className="flex items-center gap-4">
          <ToolBar photoId={photoId} isOwn={isOwn} />

          {subscriptionPlan.isSubscribed ? (
            <Button
              onClick={() => download(photoUrl ?? "", "punsplash", photoId)}
              variant={"outline"}
              size={"sm"}
              className="flex items-center shadow-md"
            >
              Download
              {isDownloading ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
          ) : (
            <Link href={"/pricing"} className={buttonVariants({ size: "sm" })}>
              <Lock className="w-4 h-4 mr-1.5" />
              Download
            </Link>
          )}
        </div>
      </div>

      <Image
        src={photoUrl ?? ""}
        width={500}
        height={500}
        alt="Photo"
        quality={98}
        className="cursor-zoom-in mt-4"
      />

      <div className="flex items-center justify-between mt-12 w-full">
        <div className="flex items-center gap-14">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Views</span>
            <span className="text-sm">{photoStatsView}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Downloads</span>
            <span className="text-sm">{photoStatsDownload}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharePopover />
          <ReportDialog />
        </div>
      </div>

      {photoDescription && (
        <div className="mt-6 text-base font-semibold text-gray-600 w-full">
          {photoDescription}
        </div>
      )}

      <div className="w-full flex flex-col gap-1 text-muted-foreground mt-6">
        {photoCountry && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />

            <span>
              {photoCity && <span>{photoCity}, </span>}
              {photoCountry}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />

          <span>
            Published {formatDistance(Date.now(), new Date(photoCreatedAt))} ago
          </span>
        </div>
        {(photoCameraMake || photoCameraModel) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>
                    {photoCameraMake}, {photoCameraModel}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent align="start">
                <div className="flex flex-col gap-2 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">Camera</span>
                    <span>
                      {photoCameraMake}, {photoCameraModel}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Lens</span>
                    <span>
                      {photoFL}mm, f/
                      {photoAV}
                    </span>
                    <span>{photoET}s</span>
                    <span>ISO {photoISO}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Dimensions</span>
                    <span>
                      {photoW} x {photoH}
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Free to use under the Unsplash License</span>
        </div>
      </div>

      <div className="mt-12 w-full">
        {tags &&
          tags.map((tag: any) => (
            <Link
              key={tag.keyword}
              href={"/"}
              className={buttonVariants({
                variant: "outline",
                className: "shadow-md font-semibold",
              })}
            >
              {tag.keyword}
            </Link>
          ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 w-full">
        <span className="text-2xl font-semibold">Related images</span>
        {photos && photos.length !== 0 ? (
          <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 mt-2 pb-40">
            {photos.map((photo: any) => (
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
                    onClick={() => download(photo.url, "punsplash", photo.id)}
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
      </div>
      <div className="mt-12 flex flex-col gap-4 w-full">
        <span className="text-2xl font-semibold">Related collections</span>
      </div>

      <div className="flex flex-col gap-6 items-center justify-between mt-12">
        <div className="flex items-center gap-2">
          <Icons.logo className="w-6 h-6" />
          Make something awesome.
        </div>
        <div className="flex items-center text-sm gap-6">
          <Link href={"/privacy"}>Privacy Policy</Link>
          <Link href={"/privacy"}>Terms</Link>
          <Link href={"/privacy"}>Security</Link>
        </div>
      </div>
    </div>
  );
};

export default PhotoDialog;
