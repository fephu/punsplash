"use client";

import { Lock, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import CollectionItemDialog from "./CollectionItemDialog";
import AddNewCollection from "./AddNewCollection";
import { cn } from "@/lib/utils";

interface CollectionDialogProps {
  photoId: string;
  userId: string;
}

const CollectionDialog = ({ photoId, userId }: CollectionDialogProps) => {
  const router = useRouter();

  const { data: photo } = trpc.getPhotoByPhotoId.useQuery({ id: photoId });

  const { data: collections } = trpc.getAllCollectionsOfUser.useQuery({
    userId,
  });

  const { data: isOwn } = trpc.checkPhotoInCollections.useQuery({ photoId });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"outline"}
          className={cn(
            "shadow-md",
            isOwn && isOwn?.length > 0
              ? "bg-green-600 text-white hover:bg-green-500 hover:text-white border-none"
              : ""
          )}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-2/3 max-w-4xl p-0 border-none">
        <div className="relative w-full h-full flex items-center">
          <div className="relative w-2/5 h-full">
            {photo && (
              <Image
                src={photo.url}
                fill
                alt="Photo add collection"
                className="absolute object-cover rounded-l-lg object-center"
              />
            )}
          </div>

          <div className="flex flex-col h-full p-6 w-3/5 gap-4 relative">
            <span className="text-center text-3xl font-bold mb-4">
              Add to Collection
            </span>
            <AddNewCollection
              title="Create new a collection"
              className="w-1/2 text-center"
            />
            <div className="absolute top-[30%] bottom-4 left-2 right-2 flex flex-col gap-2 overflow-y-scroll">
              {collections &&
                collections.map((collection: any) => (
                  <CollectionItemDialog
                    key={collection.id}
                    collectionId={collection.id}
                    title={collection.title}
                    isPrivate={collection.isPrivate}
                    photoId={photoId}
                  />
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDialog;
