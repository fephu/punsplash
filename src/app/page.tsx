import FeatureScrollArea from "@/components/FeatureScrollArea";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PhotoOnHome from "@/components/PhotoOnHome";
import Poster from "@/components/Poster";
import SearchBar from "@/components/SearchBar";
import CardCollections from "@/components/collection/CardCollections";
import ImagesSection from "@/components/profiles/ImagesSection";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";

export default async function Home() {
  const session = await getAuthSession();
  const userId = session?.user.id;

  const allFeatures = await db.feature.findMany({});

  const subscriptionPlan = await getUserSubscriptionPlan();

  const collectionsByRandom = await db.collection.findMany({
    take: 4,
    where: {
      isPrivate: false,
    },
  });

  return (
    <>
      <div className="border-b border-r-gray-200 bg-slate-50 sticky top-[calc(4rem-3px)] z-[48] shadow-sm">
        <FeatureScrollArea allFeatures={allFeatures} />
      </div>

      <MaxWidthWrapper>
        <div className="mt-20 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex flex-col justify-end gap-4 w-full">
            <span className="text-5xl font-bold">Punsplash</span>
            <span className="hidden md:block max-w-prose text-zinc-900 sm:text-lg">
              The internet’s source for visuals.
              <br />
              Powered by creators everywhere.
            </span>
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:block">
              <CardCollections collections={collectionsByRandom} />
            </div>
            <Poster />
          </div>
        </div>
        <PhotoOnHome isOwn={userId ?? ""} subscriptionPlan={subscriptionPlan} />
      </MaxWidthWrapper>
    </>
  );
}
