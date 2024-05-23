import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UpgradeButton from "@/components/pricing/UpgradeButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { getAuthSession } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus, Twitter } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  const subscriptionPlan = await getUserSubscriptionPlan();

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 10,
      features: [
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
    },
    {
      plan: "Premium",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "premium")!.quota,
      features: [
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single Photo file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <MaxWidthWrapper>
      <div className="mb-8 mt-16 text-center">
        <div className="mx-auto mb-10 sm:max-w-4xl">
          <h1 className="text-6xl font-bold sm:text-7xl">
            Upgrade to Punsplash+
          </h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, quota, features }) => {
              const price =
                PLANS.find((p) => p.slug === plan.toLowerCase())?.price
                  .amount || 0;

              return (
                <div
                  key={plan}
                  className={cn("relative rounded-2xl bg-white shadow-lg", {
                    "border-2 border-blue-600 shadow-blue-200":
                      plan === "Premium",
                    "border border-gray-200": plan !== "Premium",
                  })}
                >
                  {plan === "Premium" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                      Upgrade now
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="my-3 text-center text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500">{tagline}</p>
                    <p className="my-5 text-6xl font-semibold">${price}</p>
                    <p className="text-gray-500">per month</p>
                  </div>

                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <p>{quota.toLocaleString()} photo/mo included</p>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="cursor-default ml-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2 text-xs">
                          How many Photos you can upload per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-6 w-6 text-gray-300" />
                          ) : (
                            <Check className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-gray-400", {
                                "text-gray-600": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2 text-xs">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-gray-400", {
                              "text-gray-600": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200" />
                  <div className="p-5">
                    {plan === "Free" ? (
                      <Link
                        href={user ? `/profile/${user.username}` : "/sign-in"}
                        className={buttonVariants({
                          className: "w-full",
                          variant: "secondary",
                        })}
                      >
                        {user ? "Go to Profile" : "Sign in"}
                        <ArrowRight className="h-5 w-5 ml-1.5" />
                      </Link>
                    ) : user && !subscriptionPlan.isSubscribed ? (
                      <UpgradeButton />
                    ) : user && subscriptionPlan.isSubscribed ? (
                      <Link
                        href={"billing"}
                        className={buttonVariants({ className: "w-full" })}
                      >
                        Manage Subscription
                        <ArrowRight className="h-5 w-5 ml-1.5" />
                      </Link>
                    ) : (
                      <Link
                        href={"/sign-in"}
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        {user ? "Upgrade now" : "Sign in"}
                        <ArrowRight className="h-5 w-5 ml-1.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-col mt-28 border-b border-gray-200">
        <span className="text-4xl font-semibold">Punspash</span>
        <div className="flex items-center justify-between py-8">
          <ul className="columns-1 md:columns-3">
            <li className="p-2">
              <Link href={"/about"}>Home</Link>
            </li>
            <li className="p-2">
              <Link href={"/about"}>Pricing</Link>
            </li>
            <li className="p-2">
              <Link href={"/about"}>About</Link>
            </li>
            <li className="p-2">
              <Link href={"/blog"}>Blog</Link>
            </li>
            <li className="p-2">
              <Link href={"/blog"}>Community</Link>
            </li>
            <li className="p-2">
              <Link href={"/blog"}>Help Center</Link>
            </li>
          </ul>
          <div className="flex items-center gap-6">
            <Link href={"/"}>
              <Twitter className="w-6 h-6" />
            </Link>
            <Link href={"/"}>
              <Icons.facebook className="w-6 h-6" />
            </Link>
            <Link href={"/"}>
              <Icons.instagram className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 items-start md:flex-row md:items-center justify-between py-8">
        <div className="flex items-center gap-2">
          <Icons.logo className="w-6 h-6" />
          Make something awesome.
        </div>
        <div className="flex items-center text-sm gap-6">
          <Link href={"/privacy"}>Privacy Policy</Link>
          <Link href={"/privacy"}>Terms</Link>
          <Link href={"/privacy"}>Security</Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
