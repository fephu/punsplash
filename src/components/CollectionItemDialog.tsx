"use client";

import { trpc } from "@/app/_trpc/client";
import { Check, Loader2, Lock, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CollectionItemDialogProps {
  collectionId: string;
  title: string;
  isPrivate: boolean;
  photoId: string;
}

const CollectionItemDialog = ({
  collectionId,
  title,
  isPrivate,
  photoId,
}: CollectionItemDialogProps) => {
  const utils = trpc.useContext();
  const { data: count } = trpc.countPhotoOfCollection.useQuery({
    collectionId,
  });

  const { data: collected } = trpc.getCollectionByPhotoId.useQuery({ photoId });

  const { mutate: add, isLoading: addIsLoading } =
    trpc.addPhotoToCollection.useMutation({
      onSuccess: () => {
        utils.getCollectionByPhotoId.invalidate();
        utils.countPhotoOfCollection.invalidate();
      },
    });

  const { mutate: remove, isLoading: removeIsLoading } =
    trpc.deletePhotoToCollection.useMutation({
      onSuccess: () => {
        utils.getCollectionByPhotoId.invalidate();
        utils.countPhotoOfCollection.invalidate();
      },
    });

  const isChosen = (collectionId: string) => {
    return !!collected?.find((f: any) => f.collectionId === collectionId);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full transition rounded-lg hover:shadow-sm hover:cursor-pointer p-4",
        isChosen(collectionId) ? "bg-green-200" : "bg-neutral-200"
      )}
    >
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{count} photos</span>
        <div className="flex items-center text-lg gap-2 font-semibold">
          {isPrivate ? <Lock className="w-4 h-4" /> : null}
          {title}
        </div>
      </div>
      {isChosen(collectionId) ? (
        <Button
          onClick={() => remove({ collectionId, photoId })}
          size={"sm"}
          className="bg-green-600 hover:bg-red-600 transition"
        >
          {removeIsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </Button>
      ) : (
        <Button
          onClick={() => add({ collectionId, photoId })}
          size={"sm"}
          className="transition"
        >
          {addIsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export default CollectionItemDialog;
