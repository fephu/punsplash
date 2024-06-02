import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import FollowSection from "@/components/follow/FollowSection";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/infinite";
import { db } from "@/db";
import { fetchRedis } from "@/helpers/redis";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { User } from "next-auth";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  const subscriptionPlan = await getUserSubscriptionPlan();

  const idUser = (await fetchRedis(
    "get",
    `user:email:${session?.user.email}`
  )) as string;

  const idFollow = (await fetchRedis(
    "smembers",
    `user:${idUser}:following`
  )) as string;

  const idFollowingUser = (await fetchRedis(
    "get",
    `user:${idFollow}`
  )) as string;
  const followUser = JSON.parse(idFollowingUser) as User;

  const photos = await db.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      User: {
        email: followUser.email,
      },
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    // 4 to demonstrate infinite scroll, should be higher in production
  });

  return (
    <MaxWidthWrapper>
      <FollowSection
        userId={user?.id ?? ""}
        subscriptionPlan={subscriptionPlan}
        initialPhotos={photos}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
