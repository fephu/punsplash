"use client";

import { Heart, Plus } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CollectionDialog from "./CollectionDialog";

interface ToolBarProps {
  photoId: string;
  isOwn: string;
}

const ToolBar = ({ photoId, isOwn }: ToolBarProps) => {
  const utils = trpc.useContext();
  const router = useRouter();

  const { data: isLiked } = trpc.isLiked.useQuery({ photoId, userId: isOwn });

  const { mutate: like } = trpc.likePhoto.useMutation({
    onSuccess: () => {
      utils.isLiked.invalidate();
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
        return;
      }

      toast.error("Something went wrong!");
    },
  });

  const { mutate: unlike } = trpc.unikePhoto.useMutation({
    onSuccess: () => {
      utils.isLiked.invalidate();
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
        return;
      }

      toast.error("Something went wrong!");
    },
  });

  return (
    <div className="flex items-center gap-4">
      {isLiked ? (
        <Button
          size={"sm"}
          onClick={() => unlike({ photoId })}
          variant={"outline"}
          className="shadow-md"
        >
          <Heart className="w-4 h-4 text-red-500" fill="red" />
        </Button>
      ) : (
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => like({ photoId })}
          className="shadow-md"
        >
          <Heart className="w-4 h-4" />
        </Button>
      )}
      {isOwn ? (
        <CollectionDialog photoId={photoId} userId={isOwn} />
      ) : (
        <Link
          href={"/sign-in"}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "shadow-md",
          })}
        >
          <Plus className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

export default ToolBar;
