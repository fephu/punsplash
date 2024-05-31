import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/button";
import SearchBar from "./SearchBar";
import { getAuthSession } from "@/lib/auth";
import UserProfile from "./auth/UserProfile";
import { db } from "@/db";
import UploadDialog from "./UploadDialog";
import MobileNav from "./MobileNav";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { Bell } from "lucide-react";
import BellNotification from "./BellNotification";
import { fetchRedis } from "@/helpers/redis";
import { User } from "next-auth";

const Navbar = async () => {
  const session = await getAuthSession();
  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
  });

  const subscriptionPlan = await getUserSubscriptionPlan();

  const idToAdd = (await fetchRedis(
    "get",
    `user:email:${session?.user.email}`
  )) as string;

  const unseenNotificationCount = (
    (await fetchRedis(
      "smembers",
      `user:${idToAdd}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[50] py-2">
      <div className="container max-w-8xl h-full mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href={"/"} className="flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-lg font-semibold md:block">
            Punsplash
          </p>
        </Link>

        {/* Search bar */}

        <SearchBar userId={user?.id ?? ""} />

        <MobileNav
          subscriptionPlan={subscriptionPlan}
          isAuth={session?.user.id ?? ""}
          username={user?.username ?? ""}
        />

        <div className="hidden sm:flex items-center gap-6">
          <Link href={"/blog"} className={buttonVariants({ variant: "ghost" })}>
            Blog
          </Link>
          <Link
            href={"/pricing"}
            className={buttonVariants({ variant: "ghost" })}
          >
            Pricing
          </Link>
          {session?.user ? (
            <>
              <UploadDialog username={session.user.username ?? ""} />
              <BellNotification
                unseenNotificationCount={unseenNotificationCount}
              />
              <UserProfile
                name={user?.name ?? ""}
                email={user?.email ?? ""}
                image={user?.image ?? ""}
                username={user?.username ?? ""}
                subscriptionPlan={subscriptionPlan}
              />
            </>
          ) : (
            <>
              <Link
                href={"/sign-in"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign in
              </Link>
              <Link href={"/sign-up"} className={buttonVariants({})}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
