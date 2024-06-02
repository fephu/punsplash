import FeatureScrollArea from "@/components/FeatureScrollArea";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import FeatureSection from "@/components/feature/FeatureSection";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";

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
        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-4 px-4 py-2 border-r-2 border-gray-200">
            <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
              Editorial
            </Link>
            <Link
              href={"/following"}
              className={buttonVariants({ variant: "ghost" })}
            >
              Following
            </Link>
          </div>
          <FeatureScrollArea allFeatures={allFeatures} />
        </div>
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
