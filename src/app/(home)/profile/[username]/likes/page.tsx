import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import LikesSection from "@/components/profiles/LikesSection";
import Profile from "@/components/profiles/Profile";
import { db } from "@/db";
import { fetchRedis } from "@/helpers/redis";
import { getAuthSession } from "@/lib/auth";
import { Metadata, ResolvingMetadata } from "next";

interface PageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });

  return {
    title: `${user?.name} (@${user?.username})`,
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();

  const userId = session?.user.id;

  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });

  const idUser = (await fetchRedis(
    "get",
    `user:email:${session?.user.email}`
  )) as string;

  const idToAdd = (await fetchRedis(
    "get",
    `user:email:${user?.email}`
  )) as string;

  const isAlreadyFriends = (await fetchRedis(
    "sismember",
    `user:${idUser}:following`,
    idToAdd
  )) as 0 | 1;

  return (
    <MaxWidthWrapper>
      <Profile user={user} userId={userId ?? ""} isFollowed={isAlreadyFriends}>
        <LikesSection user={user} isOwn={userId ?? ""} />
      </Profile>
    </MaxWidthWrapper>
  );
};

export default Page;
