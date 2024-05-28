import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CollectionsSection from "@/components/profiles/CollectionsSection";
import LikesSection from "@/components/profiles/LikesSection";
import Profile from "@/components/profiles/Profile";
import { db } from "@/db";
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

  return (
    <MaxWidthWrapper>
      <Profile user={user} userId={userId ?? ""}>
        <CollectionsSection user={user} isOwn={!!userId} />
      </Profile>
    </MaxWidthWrapper>
  );
};

export default Page;
