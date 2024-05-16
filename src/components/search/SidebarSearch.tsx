"use client";

import {
  ArrowUpDown,
  Folder,
  ImageIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";

const SideBarSearch = () => {
  const [current, setCurrent] = useState<string>("photos");
  const pathname = usePathname();

  const key = pathname.split("/");

  const { data: countSearch } = trpc.countSearch.useQuery({ key: key[3] });

  return (
    <div className="border-b border-r-gray-200 bg-slate-50 sticky top-[calc(4rem-3px)] z-[48] shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Link
            href={pathname.replace(current, "photos")}
            className={buttonVariants({
              variant: "ghost",
              className: pathname.includes("photos")
                ? "border-b-2 border-gray-600 rounded-none"
                : "",
            })}
            onClick={() => setCurrent("photos")}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            <div className="flex items-center gap-2">
              <span>Photos</span>
              <span>{countSearch?.countPhoto}</span>
            </div>
          </Link>

          <Link
            href={pathname.replace(current, "collections")}
            className={buttonVariants({
              variant: "ghost",
              className: pathname.includes("collections")
                ? "border-b-2 border-gray-600 rounded-none"
                : "",
            })}
            onClick={() => setCurrent("collections")}
          >
            <Folder className="w-4 h-4 mr-2" />
            <div className="flex items-center gap-2">
              <span>Collections</span>
              <span>{countSearch?.countCollection}</span>
            </div>
          </Link>
          <Link
            href={pathname.replace(current, "users")}
            className={buttonVariants({
              variant: "ghost",
              className: pathname.includes("users")
                ? "border-b-2 border-gray-600 rounded-none"
                : "",
            })}
            onClick={() => setCurrent("users")}
          >
            <User className="w-4 h-4 mr-2" />
            <div className="flex items-center gap-2">
              <span>Users</span>
              <span>{countSearch?.countUser}</span>
            </div>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Select>
            <SelectTrigger className="pl-0">
              <div className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <ShieldCheck className="w-4 h-4 mr-2" />
                <SelectValue
                  defaultValue={"All"}
                  placeholder="License All"
                  className="font-semibold ml-1"
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>License</SelectLabel>
                <SelectItem value="all">License All</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="pl-0">
              <div className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <span className="mr-2">Sort by</span>
                <SelectValue
                  defaultValue={"relevance"}
                  placeholder={"Relevance"}
                  className="font-semibold ml-1"
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="curated">Curated</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SideBarSearch;
