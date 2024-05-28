import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import HiringSettings from "@/components/account/HiringSettings";
import { getAuthSession } from "@/lib/auth";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  return (
    <MaxWidthWrapper>
      <HiringSettings userId={user?.id ?? ""} />
    </MaxWidthWrapper>
  );
};

export default Page;
