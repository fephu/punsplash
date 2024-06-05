"use client";

import { User } from "@prisma/client";
import Link from "next/link";

import { Check, Loader2 } from "lucide-react";

import Image from "next/image";

import Dropzone from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Icons } from "../Icons";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  TUpdateProfileValidators,
  UpdateProfileValidators,
} from "@/lib/validators/update-profile-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface AccountSettingsProps {
  userId: string;
}

const AccountSettings = ({ userId }: AccountSettingsProps) => {
  const utils = trpc.useContext();

  const { data: user } = trpc.getUserById.useQuery({ userId });

  const { mutate: update, isLoading } =
    trpc.profileRouter.updatingProfile.useMutation({
      onSuccess: () => {
        toast.success("Updated profile successfully.");
        utils.getUserById.invalidate();
      },
      onError: () => {
        toast.error("Something went wrong!");
      },
    });

  const accepted = {
    "image/*": [".jpeg", ".jpg", ".png"],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUpdateProfileValidators>({
    resolver: zodResolver(UpdateProfileValidators),
  });

  const onSubmit = ({
    name,
    username,
    location,
    portfolio,
    bio,
    insUsername,
    xUsername,
  }: TUpdateProfileValidators) => {
    update({
      name,
      username,
      location,
      portfolio,
      bio,
      insUsername,
      xUsername,
    });
    reset();
  };

  const { startUpload } = useUploadThing("imageProfile");
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
        <div className="mt-8 flex flex-col pb-5 w-full">
          <div className="flex justify-between items-center">
            <h1 className="mb-3 font-bold text-2xl text-gray-900">
              Edit Profile
            </h1>
            <Badge
              className="mb-3 bg-green-200 text-green-400"
              variant={"outline"}
            >
              <Check className="w-3 h-3 mr-1.5" />
              Account Confirmed
            </Badge>
          </div>

          <form
            className="flex flex-col w-full gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex items-center w-full flex-col lg:flex-row">
              <div className="flex flex-col items-center px-10 w-1/3 py-5">
                <Dropzone
                  multiple={false}
                  accept={accepted}
                  onDrop={async (acceptedFile) => {
                    const res = await startUpload(acceptedFile);

                    if (!res) {
                      return toast.error(
                        "Something went wrong. Please try again."
                      );
                    }

                    utils.getUserById.invalidate();
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="flex flex-col items-center"
                    >
                      <Avatar className="relative w-40 h-40">
                        {user?.image ? (
                          <div className="relative aspect-square h-full w-full">
                            <Image
                              src={user?.image}
                              fill
                              alt="Profile Picture"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <AvatarFallback>
                            <span className="sr-only">{user?.name}</span>
                            <Icons.user className="h-4 w-4 text-zinc-900" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button variant={"link"} size={"sm"} className="mt-2">
                        <input {...getInputProps()} />
                        <p>Change profile image</p>
                      </Button>
                    </div>
                  )}
                </Dropzone>
              </div>

              <div className="grid gap-4 w-full">
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    className="col-span-2 h-10"
                    defaultValue={user?.name ?? ""}
                  />
                  {errors?.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className="col-span-2 h-10"
                    defaultValue={user?.email ?? ""}
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="username">
                    Username{" "}
                    <span className="text-muted-foreground">
                      (only letters, numbers and underscores)
                    </span>
                  </Label>
                  <Input
                    {...register("username")}
                    id="username"
                    className="col-span-2 h-10"
                    defaultValue={user?.username ?? ""}
                  />
                  {errors?.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <span className="font-semibold text-lg">About</span>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  {...register("location")}
                  id="location"
                  className="col-span-2 h-10"
                  defaultValue={user?.location ?? ""}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="portfolio">Personal site/portfolio</Label>
                <Input
                  {...register("portfolio")}
                  id="portfolio"
                  className="col-span-2 h-10"
                  defaultValue={user?.portfolio ?? ""}
                  placeholder="https://"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  {...register("bio")}
                  id="bio"
                  className="col-span-2 h-28 resize-none"
                  defaultValue={user?.bio ?? ""}
                />
              </div>
            </div>

            <span className="font-semibold text-lg">Social</span>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="insUsername">Instagram username</Label>
                <Input
                  {...register("insUsername")}
                  id="insUsername"
                  className="col-span-2 h-10"
                  defaultValue={user?.insUsername ?? ""}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="xUsername">X username</Label>
                <Input
                  {...register("xUsername")}
                  id="xUsername"
                  className="col-span-2 h-10"
                  defaultValue={user?.xUsername ?? ""}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">
              {isLoading && <Loader2 className="w-4 h-4 mr-1.5" />}
              Update account
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

export default AccountSettings;
