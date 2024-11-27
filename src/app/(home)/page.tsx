import CarouselHomePage from "@/components/CarouselHomePage";
import FeatureScrollArea from "@/components/FeatureScrollArea";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PhotoOnHome from "@/components/PhotoOnHome";
import Poster from "@/components/Poster";
import SearchBar from "@/components/SearchBar";
import CardCollections from "@/components/collection/CardCollections";
import ImagesSection from "@/components/profiles/ImagesSection";
import { buttonVariants } from "@/components/ui/button";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/infinite";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Link from "next/link";

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

  const photos = await db.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Keyword: true,
      PhotoCollection: true,
      PhotoFeature: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    // 4 to demonstrate infinite scroll, should be higher in production
  });

  return (
    <>
      <div className="border-b border-r-gray-200 bg-slate-50 sticky top-[calc(4rem-6px)] z-[48] shadow-sm">
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

      <MaxWidthWrapper>
        <div className="mt-20 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex flex-col justify-end gap-4 w-full">
            <span className="text-5xl font-bold">Punsplash</span>
            <span className="hidden md:flex max-w-prose text-zinc-900 sm:text-lg">
              The internet’s source for visuals.
              <br />
              Powered by creators everywhere.
            </span>
            <div className="hidden md:block">
              <SearchBar userId={userId ?? ""} />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <CardCollections collections={collectionsByRandom} />

            <Poster />
          </div>
          <CarouselHomePage collections={collectionsByRandom} />
        </div>
        <PhotoOnHome
          initialPhotos={photos}
          isOwn={userId ?? ""}
          subscriptionPlan={subscriptionPlan}
        />
      </MaxWidthWrapper>
    </>
  );
}
