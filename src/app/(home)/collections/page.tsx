import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Collections from "@/components/collection/Collections";
import { getAuthSession } from "@/lib/auth";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  return (
    <MaxWidthWrapper>
      <Collections userId={user?.id ?? ""} />
    </MaxWidthWrapper>
  );
};

export default Page;
