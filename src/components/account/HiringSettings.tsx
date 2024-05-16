"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Icons } from "../Icons";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { User } from "@prisma/client";

const interestedWork = [
  {
    label: "Wedding",
    value: "wedding",
  },
  {
    label: "Portrait",
    value: "portrait",
  },
  {
    label: "Newborn",
    value: "newborn",
  },
  {
    label: "Food",
    value: "food",
  },
  {
    label: "Boudoir",
    value: "boudoir",
  },
  {
    label: "Fashion",
    value: "fashion",
  },
  {
    label: "Product",
    value: "product",
  },
  {
    label: "Real Estate",
    value: "real_estate",
  },
  {
    label: "Event",
    value: "event",
  },
  {
    label: "Life Style",
    value: "life_style",
  },
  {
    label: "Markerting & Social Media",
    value: "markerting_social_media",
  },
  {
    label: "Travel",
    value: "travel",
  },
];

const cities = [
  {
    label: "Ho Chi Minh City, Vietnam",
    value: "hochiminh_city_vietnam",
  },
  {
    label: "New York City, USA",
    value: "newyork_city_usa",
  },
  {
    label: "Tokyo, Japan",
    value: "tokyo_japan",
  },
  {
    label: "London, UK",
    value: "london_uk",
  },
  {
    label: "Berlin, Germany",
    value: "berlin_germany",
  },
  {
    label: "Paris, France",
    value: "paris_france",
  },
];

interface HiringSettingsProps {
  userId: string;
}

const HiringSettings = ({ userId }: HiringSettingsProps) => {
  const { data: user } = trpc.profileRouter.getUser.useQuery();
  const [isHired, setIsHired] = useState<boolean | undefined>(user?.isHired);

  const onChange = () => {
    setIsHired(!isHired);
  };

  const { mutate: updateHiring } = trpc.profileRouter.updateHiring.useMutation({
    onSuccess: () => {
      toast.success("Updated hiring.");
    },
  });

  return (
    <>
      <div className="flex mt-6">
        <div className="mt-8 hidden md:flex flex-col items-start gap-4 pb-5 w-1/3">
          <h1 className="mb-3 font-bold text-2xl text-gray-900">
            Account settings
          </h1>

          <ul>
            <li>
              <Link
                className={buttonVariants({ variant: "link" })}
                href={"/account"}
              >
                Edit profile
              </Link>
            </li>
            <li>
              <Link
                className={buttonVariants({ variant: "link" })}
                href={"/account/hiring"}
              >
                Hiring
              </Link>
            </li>
            <li>
              <Link
                className={buttonVariants({ variant: "link" })}
                href={"/account/history"}
              >
                Download history
              </Link>
            </li>
            <li>
              <Link
                className={buttonVariants({
                  variant: "link",
                })}
                href={"/account/password"}
              >
                Change password
              </Link>
            </li>
            <li>
              <Link
                className={buttonVariants({ variant: "link" })}
                href={"/account/delete"}
              >
                Delete account
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col w-full mx-auto mt-8 gap-8">
          <div>
            <span className="font-semibold text-2xl">
              Interested in freelance photography work?
            </span>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6 bg-gray-200 p-2 rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox checked={isHired} onCheckedChange={onChange} />
                <label className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Yes, feature my Punplash profile on hiring pages and display a
                  &apos;Hire&apos; button
                </label>
              </div>
              <Button size={"sm"}>Hire</Button>
            </div>
          </div>

          <form>
            <fieldset disabled={!isHired}>
              What kind of photography work are you interested in?
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 border border-gray-500 rounded-md p-2 my-4">
                {interestedWork.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center space-x-2 p-2"
                  >
                    <Checkbox />
                    <label className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset disabled={!isHired}>
              In which cites are you available to shoot?
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 border border-gray-500 rounded-md p-2 my-4">
                {cities.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center space-x-2 p-2"
                  >
                    <Checkbox />
                    <label className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <Button
              onClick={() => updateHiring({ hire: !isHired })}
              className="mt-4 w-full"
            >
              Update hiring availability
            </Button>
          </form>
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
              <Icons.X className="w-6 h-6" />
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
    </>
  );
};

export default HiringSettings;
