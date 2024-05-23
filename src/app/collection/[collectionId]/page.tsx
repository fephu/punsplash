import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CollectionSection from "@/components/collection/CollectionSection";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface PageProps {
  params: {
    collectionId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();

  const userId = session?.user.id;

  const subscriptionPlan = await getUserSubscriptionPlan();

  const user = await db.user.findFirst({
    where: {
      Collection: {
        some: {
          id: params.collectionId,
        },
      },
    },
  });

  return (
    <MaxWidthWrapper>
      <CollectionSection
        subscriptionPlan={subscriptionPlan}
        user={user}
        isOwn={userId ?? ""}
        collectionId={params.collectionId}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
