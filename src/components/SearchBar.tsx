"use client";

import {
  Eraser,
  Loader2,
  ScanSearch,
  Search,
  TrendingUp,
  X,
  XIcon,
} from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import VisualSearch from "./search/VisualSearch";
import Link from "next/link";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { trpc } from "@/app/_trpc/client";
import { Feature } from "@prisma/client";
import Image from "next/image";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: FiveTopicTrending } =
    trpc.featureRouter.get5TopicTrending.useQuery();

  const search = () => {
    startTransition(() => {
      setIsOpen(false);
      window.localStorage.setItem("recentSearches", JSON.stringify([query]));
      router.push(`/s/photos/${query.replace(/\s/g, "-")}`);
    });
  };

  return (
    <div className="relative w-full h-11 max-w-3xl flex flex-col bg-white rounded-md mx-4 md:mx-0">
      <div className="relative h-11 z-10 rounded-md">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
            if (e.key === "Escape") {
              setIsOpen(false);
              inputRef?.current?.blur();
            }
          }}
          onClick={() => setIsOpen(!isOpen)}
          ref={inputRef}
          className="absolute inset-0 h-full pl-9"
          placeholder="Search high-resolution images"
        />
        <div className="absolute top-1.5 left-1 p-2">
          <Search className="w-4 h-4" />
        </div>
        {query.length > 0 && (
          <Button
            disabled={isSearching}
            className="absolute top-1 right-10"
            size={"sm"}
            variant={"ghost"}
            onClick={() => setQuery("")}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-3 h-3" />
            )}
          </Button>
        )}

        {isOpen && (
          <div className="absolute bg-white top-[110%] w-full rounded-md">
            <div className="flex flex-col px-6 pt-2 pb-4 gap-4">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span>Recent Searches</span>
                  <Button variant={"ghost"} size={"sm"}>
                    <Eraser className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span>Trending Searches</span>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href={"/s/photos/Sea"}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Sea
                  </Link>
                  <Link
                    href={"/s/photos/Surf"}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Surf
                  </Link>
                  <Link
                    href={"/s/photos/Ocean"}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ocean
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span>Trending Topics</span>
                <div className="flex items-center gap-6 flex-wrap">
                  {FiveTopicTrending &&
                    FiveTopicTrending.map((topic: Feature) => (
                      <Link
                        href={`/t/${topic.value}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        {topic.name}
                      </Link>
                    ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span>Trending Collections</span>
              </div>
            </div>
          </div>
        )}

        <div className="hidden lg:block">
          <VisualSearch />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
