import CloseButton from "@/components/photo/CloseButton";
import PhotoDialog from "@/components/photo/PhotoDialog";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface PageProps {
  params: {
    photoId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();
  const userId = session?.user.id;

  const photoId = params.photoId;

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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
