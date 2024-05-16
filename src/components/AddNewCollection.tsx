"use client";

import { Lock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import {
  CreateCollectionValidator,
  TCreateCollectionValidator,
} from "@/lib/validators/create-collection-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { useState } from "react";

interface AddNewCollectionProps {
  className?: string;
  title: string;
}

const AddNewCollection = ({ className, title }: AddNewCollectionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const utils = trpc.useContext();
  const { mutate: addNewCollection } = trpc.addNewCollection.useMutation({
    onSuccess: () => {
      utils.getAllCollectionsOfUser.invalidate();
      toast.success(`Added collection`);
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateCollectionValidator>({
    resolver: zodResolver(CreateCollectionValidator),
  });

  const onSubmit = ({
    title,
    subtitle,
    isPrivate,
  }: TCreateCollectionValidator) => {
    addNewCollection({ title, subtitle, isPrivate });
    reset();
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>{title}</Button>
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
          <div className="grid gap-4">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                {...register("title")}
                id="title"
                className="col-span-2 h-8"
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
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isPrivate")}
                id="isPrivate"
                defaultChecked
              />
              <Label htmlFor="isPrivate" className="flex items-center">
                Make collection private
                <Lock className="w-4 h-4 ml-1.5" />
              </Label>
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCollection;
