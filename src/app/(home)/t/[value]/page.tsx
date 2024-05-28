import FeatureScrollArea from "@/components/FeatureScrollArea";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import FeatureSection from "@/components/feature/FeatureSection";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Image from "next/image";

interface PageProps {
  params: {
    value: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const allFeatures = await db.feature.findMany({});

  const session = await getAuthSession();

  const userId = session?.user.id;

  const subscriptionPlan = await getUserSubscriptionPlan();

  const feature = await db.feature.findFirst({
    where: {
      value: params.value,
    },
  });

  return (
    <>
      <div className="border-b border-r-gray-200 bg-slate-50 sticky top-[calc(4rem-3px)] z-[48] shadow-sm">
        <FeatureScrollArea allFeatures={allFeatures} />
      </div>
      <FeatureSection
        subscriptionPlan={subscriptionPlan}
        feature={feature}
        isOwn={userId ?? ""}
      />
    </>
  );
};

export default Page;
