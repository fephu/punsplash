"use client";

import { ScanSearch, Search, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useCallback, useRef, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import VisualSearch from "./search/VisualSearch";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();

  const search = () => {
    startTransition(() => {
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
              inputRef?.current?.blur();
            }
          }}
          ref={inputRef}
          className="absolute inset-0 h-full pl-9"
          placeholder="Search high-resolution images"
        />
        <div className="absolute top-1.5 left-1 p-2">
          <Search className="w-4 h-4" />
        </div>
        {query.length > 0 && (
          <Button
            className="absolute top-1 right-10"
            size={"sm"}
            variant={"ghost"}
            onClick={() => setQuery("")}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
        <div className="hidden lg:block">
          <VisualSearch />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
