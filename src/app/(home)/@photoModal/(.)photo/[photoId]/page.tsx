import CloseButton from "@/components/photo/CloseButton";
import PhotoDialog from "@/components/photo/PhotoDialog";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { notFound } from "next/navigation";

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
    where: { id: photoId },
  });

  if (!photo) notFound();

  await db.photo.update({
    where: { id: photoId },
    data: {
      statViews: {
        increment: 1,
      },
    },
  });

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="bg-black/80 flex justify-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <CloseButton />
      <div className="relative w-full my-6 mx-auto max-w-screen-xl h-screen">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="relative px-4 pb-6 w-full">
            <PhotoDialog
              photoId={photoId}
              isOwn={userId ?? ""}
              subscriptionPlan={subscriptionPlan}
              photoUrl={photo.url}
              photoUserId={photo.userId ?? ""}
              photoStatsView={photo.statViews}
              photoStatsDownload={photo.statDownload}
              photoDescription={photo.description ?? ""}
              photoCity={photo.photo_location_city ?? ""}
              photoCountry={photo.photo_location_country ?? ""}
              photoCreatedAt={photo.createdAt ?? ""}
              photoCameraMake={photo.exif_camera_make ?? ""}
              photoCameraModel={photo.exif_camera_model ?? ""}
              photoAV={photo.exif_aperture_value ?? 0}
              photoET={photo.exif_exposure_time ?? ""}
              photoFL={photo.exif_focal_length ?? 0}
              photoISO={photo.exif_iso ?? 0}
              photoW={photo.width ?? 0}
              photoH={photo.height ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
