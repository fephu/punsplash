import AvatarHover from "@/components/AvatarHover";
import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ToolBar from "@/components/ToolBar";
import PhotoDialog from "@/components/photo/PhotoDialog";
import ReportDialog from "@/components/photo/ReportDialog";
import SharePopover from "@/components/photo/SharePopover";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";
import {
  Calendar,
  Camera,
  ChevronLeft,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: {
    photoId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();
  const userId = session?.user.id;

  const photoId = params.photoId;

  const photo = await db.photo.findFirst({
    where: {
      id: photoId,
    },
  });

  return (
    <div className="flex relative flex-col items-center w-full h-full mt-16 bg-white px-4 pb-10">
      <div className="flex sticky top-[calc(4rem-3px)] h-16 z-50 bg-white items-center justify-between w-full">
        <AvatarHover className="text-black" userId={photo?.userId ?? ""} />
        <div className="flex items-center gap-4">
          <ToolBar photoId={photoId} isOwn={userId ?? ""} />

          <Link
            href={"/pricing"}
            className={buttonVariants({
              size: "sm",
            })}
          >
            <Lock className="h-4 w-4 mr-1" />
            Download
          </Link>
        </div>
      </div>

      <Image
        src={photo?.url ?? ""}
        width={500}
        height={500}
        alt="Photo"
        quality={98}
        className="cursor-zoom-in mt-2"
      />

      <div className="flex items-center justify-between mt-12 w-full">
        <div className="flex items-center gap-14">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Views</span>
            <span className="text-sm">{photo?.statViews}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Downloads</span>
            <span className="text-sm">50,763</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharePopover />
          <ReportDialog />
        </div>
      </div>

      {photo?.description && (
        <div className="mt-6 text-base font-semibold text-gray-600 w-full">
          {photo.description}
        </div>
      )}

      <div className="w-full flex flex-col gap-1 text-muted-foreground mt-6">
        {photo?.photo_location_country && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />

            <span>
              {photo.photo_location_city && (
                <span>{photo.photo_location_city}, </span>
              )}
              {photo?.photo_location_country}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />

          <span>
            Published{" "}
            {formatDistance(Date.now(), new Date(photo?.createdAt ?? ""))} ago
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>
                  {photo?.exif_camera_make}, {photo?.exif_camera_model}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="start">
              <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col">
                  <span className="font-semibold">Camera</span>
                  <span>
                    {photo?.exif_camera_make}, {photo?.exif_camera_model}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Lens</span>
                  <span>
                    {photo?.exif_focal_length}mm, f/
                    {photo?.exif_aperture_value}
                  </span>
                  <span>{photo?.exif_exposure_time}s</span>
                  <span>ISO {photo?.exif_iso}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Dimensions</span>
                  <span>
                    {photo?.width} x {photo?.height}
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Free to use under the Unsplash License</span>
        </div>
      </div>

      {/* <div className="mt-12 w-full">
          {tags &&
            tags.map((tag) => (
              <Link
                href={"/"}
                className={buttonVariants({
                  variant: "outline",
                  className: "shadow-md font-semibold",
                })}
              >
                {tag.keyword}
              </Link>
            ))}
        </div> */}

      {/* <div className="mt-12 flex flex-col gap-4 w-full">
          <span className="text-2xl font-semibold">Related images</span>
          {photos && photos.length !== 0 ? (
            <ul className="columns-1 md:columns-2 xl:columns-3 gap-6 mt-2 pb-40">
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
              <h3 className="font-semibold text-xl">
                Pretty empty around here
              </h3>
              <p>Let&apos;s upload your first photo.</p>
            </div>
          )}
        </div> */}
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

export default Page;
