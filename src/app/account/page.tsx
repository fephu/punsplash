import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import AccountSettings from "@/components/account/AccountSettings";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  return (
    <MaxWidthWrapper>
      <AccountSettings userId={user?.id ?? ""} />
    </MaxWidthWrapper>
  );
};

export default Page;
