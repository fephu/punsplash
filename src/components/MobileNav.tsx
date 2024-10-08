"use client";

import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UploadDialog from "./UploadDialog";
import UserProfile from "./auth/UserProfile";
import { trpc } from "@/app/_trpc/client";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const MobileNav = ({
  isAuth,
  username,
  subscriptionPlan,
}: {
  isAuth: string;
  username: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: user } = trpc.getUserById.useQuery({ userId: isAuth });

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="sm:hidden">
      {isOpen ? (
        <X
          onClick={toggle}
          className="relative z-[100] h-5 w-5 text-zinc-700 hover:cursor-pointer"
        />
      ) : (
        <Menu
          onClick={toggle}
          className="relative z-[100] h-5 w-5 text-zinc-700 hover:cursor-pointer"
        />
      )}

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-[80] w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-10 pb-8">
            {!user || !user.id ? (
              <>
                <li>
                  <Link href={"/blog"}>Blog</Link>
                </li>
                <li>
                  <Link href={"/pricing"}>Pricing</Link>
                </li>
                <li>
                  <Link href={"/sign-in"}>Sign in</Link>
                </li>
                <li>
                  <Link href={"/sign-up"} className="flex items-center">
                    Get started
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <UserProfile
                    subscriptionPlan={subscriptionPlan}
                    image={user.image ?? ""}
                    name={user.name ?? ""}
                    email={user.email ?? ""}
                    username={user.username ?? ""}
                  />
                </li>
                <li>
                  <Link href={"/blog"}>Blog</Link>
                </li>
                <li>
                  <Link href={"/pricing"}>Pricing</Link>
                </li>
                <li>
                  <UploadDialog username={username} />
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
