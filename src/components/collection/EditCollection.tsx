"use client";

import { Loader2, Lock } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCollectionValidator,
  TCreateCollectionValidator,
} from "@/lib/validators/create-collection-validators";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Collection } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";

interface EditCollectionProps {
  collection: Collection | undefined | null;
}

const EditCollection = ({ collection }: EditCollectionProps) => {
  const router = useRouter();

  const { data: user } = trpc.profileRouter.getUser.useQuery();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateCollectionValidator>({
    resolver: zodResolver(CreateCollectionValidator),
  });

  const { mutate: edit, isLoading } =
    trpc.collectionRouter.editCollection.useMutation({
      onSuccess: () => {
        utils.collectionRouter.getCollectionById.invalidate();
        toast.success(`Edited collection`);
      },
    });

  const { mutate: deleteCollection } =
    trpc.collectionRouter.deleteACollection.useMutation({
      onSuccess: () => {
        router.push(`/profile/${user?.username}/collections`);
      },
    });

  const onSubmit = ({
    title,
    subtitle,
    isPrivate,
  }: TCreateCollectionValidator) => {
    edit({ title, subtitle, isPrivate, collectionId: collection?.id ?? "" });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium leading-none text-2xl">
            Collection
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Set the detail for the collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                {...register("title")}
                id="title"
                className="col-span-2 h-8"
                defaultValue={collection?.title}
              />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                {...register("subtitle")}
                id="subtitle"
                className="col-span-2 h-8"
                defaultValue={collection?.subtitle ?? ""}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isPrivate")}
                id="isPrivate"
                defaultChecked={collection?.isPrivate}
              />
              <Label htmlFor="isPrivate" className="flex items-center">
                Make collection private
                <Lock className="w-4 h-4 ml-1.5" />
              </Label>
            </div>
            <div className="flex items-center justify-between w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"} size={"sm"}>
                    Delete Collection
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanetly delete
                      your collection and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonVariants({ variant: "destructive" })}
                      onClick={() =>
                        deleteCollection({ id: collection?.id ?? "" })
                      }
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit">
                Save{" "}
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCollection;
