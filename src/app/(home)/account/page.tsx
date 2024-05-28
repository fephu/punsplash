import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import AccountSettings from "@/components/account/AccountSettings";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user) return notFound();

  return (
    <MaxWidthWrapper>
      <AccountSettings userId={user?.id ?? ""} />
    </MaxWidthWrapper>
  );
};

export default Page;
