"use client";

import { trpc } from "@/app/_trpc/client";
import { Input } from "../ui/input";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface TagsInputProps {
  photoId: string;
  values: string[];
}

const TagsInput = ({ photoId, values }: TagsInputProps) => {
  const [tags, setTags] = useState(values);

  const { mutate: addTags } = trpc.photoRouter.addTags.useMutation({});

  const { mutate: removeTags } = trpc.photoRouter.removeTags.useMutation({});

  return (
    <>
      <div className="flex items-center py-1 border border-gray-200 rounded-md shadow-sm w-full">
        <div className="flex items-center gap-2 ml-2">
          {tags?.map((tag: string, i: number) => (
            <div
              key={tag}
              className="border text-base rounded-md px-2 py-1 flex items-center"
            >
              {tag}
              <X
                className="w-2.5 h-2.5 ml-1.5"
                onClick={() => {
                  removeTags({ photoId, tag });
                  setTags(tags?.filter((el, index) => index !== i));
                }}
              />
            </div>
          ))}
        </div>
        <Input
          placeholder="Add tag"
          type="text"
          className="border-none text-base"
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value;
            if (
              (e.key === "," || e.key === "Enter" || e.key === "Tab") &&
              value.length &&
              !tags?.includes(value)
            ) {
              e.preventDefault();
              addTags({ photoId, tag: value });
              (e.target as HTMLInputElement).value = "";
              setTags((prevTags) => [...prevTags, value]);
            } else {
            }
          }}
        />
      </div>
    </>
  );
};

export default TagsInput;
