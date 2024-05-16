"use client";

import { trpc } from "@/app/_trpc/client";
import { Input } from "../ui/input";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface TagsInputProps {
  photoId: string;
}

const TagsInput = ({ photoId }: TagsInputProps) => {
  const { data: tagsPhoto } = trpc.photoRouter.getAllTagsOfPhoto.useQuery({
    id: photoId,
  });

  const flatTag = tagsPhoto && tagsPhoto.map((tag) => tag.keyword);

  const removeTag = (index: number) => {
    setTags(tags?.filter((el, i) => i !== index));
  };

  const [tags, setTags] = useState(flatTag);

  const { mutate: updateTags, isLoading } =
    trpc.photoRouter.addTags.useMutation({});

  return (
    <>
      <div className="flex items-center py-1 border border-gray-200 rounded-md shadow-sm w-full">
        <div className="flex items-center gap-2 ml-2">
          {tags?.map((tag, i) => (
            <div
              key={tag}
              className="border text-base rounded-md px-2 py-1 flex items-center"
            >
              {tag}
              <X className="w-2.5 h-2.5 ml-1.5" onClick={() => removeTag(i)} />
            </div>
          ))}
        </div>
        <Input
          placeholder="Add tag"
          type="text"
          className="border-none text-base"
          onKeyDown={(e) => {
            if (e.key !== "Enter") {
              return;
            }

            const value = (e.target as HTMLInputElement).value;
            if (!value.trim()) return;
            if (e.key === "Enter") {
              setTags([...tags, value]);
            }
            (e.target as HTMLInputElement).value = "";
          }}
        />
      </div>
      <div className="absolute bottom-8 right-8 flex items-center gap-8">
        <Button onClick={() => updateTags({ tags: tags ?? [], photoId })}>
          Update tags
          {isLoading && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
        </Button>
      </div>
    </>
  );
};

export default TagsInput;
