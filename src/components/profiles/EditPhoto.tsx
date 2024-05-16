"use client";

import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Loader2, LocateIcon, X } from "lucide-react";
import SelectCities from "../photo/SelectCities";
import { useState } from "react";
import Link from "next/link";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Keyword } from "@prisma/client";
import TagsInput from "./TagsInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUpdatePhotoValidators,
  UpdatePhotoValidators,
} from "@/lib/validators/update-photo-validators";
import FeatureForm from "./FeatureForm";

interface EditPhotoProps {
  photoId: string;
}

const EditPhoto = ({ photoId }: EditPhotoProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("details");

  const utils = trpc.useContext();

  const { data: photo } = trpc.getPhotoByPhotoId.useQuery({ id: photoId });

  const { mutate: deleteImage } = trpc.photoRouter.deleteImage.useMutation({
    onSuccess: () => {
      toast.success("Deleted image.");
      utils.profileRouter.getUserPhotos.invalidate();
    },
  });

  const { mutate: updatePhoto, isLoading } =
    trpc.photoRouter.uploadPhoto.useMutation({
      onSuccess: () => {
        toast.success("Great.");
      },
    });

  const onDelete = () => {
    deleteImage({ id: photo?.id ?? "" });
    setIsOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUpdatePhotoValidators>({
    resolver: zodResolver(UpdatePhotoValidators),
  });

  const onSubmit = ({
    description,
    camera_make,
    camera_model,
    focal_length,
    aperture,
    iso,
    speed,
  }: TUpdatePhotoValidators) => {
    updatePhoto({
      photoId,
      description,
      camera_make,
      camera_model,
      focal_length,
      aperture,
      iso,
      speed,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-screen h-4/5 max-w-6xl p-0 border-none">
        <div className="relative w-full h-full flex">
          <div className="relative w-2/5 h-full hidden md:block">
            {photo && (
              <Image
                src={photo.url}
                fill
                alt="Photo add collection"
                className="absolute object-cover rounded-l-lg object-center"
              />
            )}
          </div>
          <div className="w-full md:w-3/5 relative">
            <div className="w-full flex items-center border-b border-gray-200 pt-2">
              <Button
                variant={"ghost"}
                onClick={() => setSelected("details")}
                className={cn(
                  "text-base font-semibold",
                  selected.toLowerCase() === "details"
                    ? "border-b-2 border-gray-600 rounded-none"
                    : ""
                )}
              >
                Details
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setSelected("tags")}
                className={cn(
                  "text-base font-semibold",
                  selected.toLowerCase() === "tags"
                    ? "border-b-2 border-gray-600 rounded-none"
                    : ""
                )}
              >
                Tags
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setSelected("feature")}
                className={cn(
                  "text-base font-semibold",
                  selected.toLowerCase() === "feature"
                    ? "border-b-2 border-gray-600 rounded-none"
                    : ""
                )}
              >
                Feature
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setSelected("settings")}
                className={cn(
                  "text-base font-semibold",
                  selected.toLowerCase() === "settings"
                    ? "border-b-2 border-gray-600 rounded-none"
                    : ""
                )}
              >
                Settings
              </Button>
            </div>
            {selected === "details" ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-base" htmlFor="description">
                      Description
                    </Label>
                    <Textarea
                      {...register("description")}
                      id="description"
                      className="col-span-2 h-28 resize-none text-base"
                      defaultValue={photo?.description ?? ""}
                    />
                    {errors?.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-base">Location</Label>
                    <SelectCities
                      label={photo?.photo_location_city ?? ""}
                      country={photo?.photo_location_country ?? ""}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full gap-4">
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="camera_make" className="text-base">
                        Camera Make
                      </Label>
                      <Input
                        {...register("camera_make")}
                        id="camera_make"
                        className="col-span-2 h-10 text-sm"
                        defaultValue={photo?.exif_camera_make ?? ""}
                      />
                      {errors?.camera_make && (
                        <p className="text-sm text-red-500">
                          {errors.camera_make.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="camera_model" className="text-base">
                        Camera Model
                      </Label>
                      <Input
                        {...register("camera_model")}
                        id="camera_model"
                        className="col-span-2 h-10"
                        defaultValue={photo?.exif_camera_model ?? ""}
                      />
                      {errors?.camera_model && (
                        <p className="text-sm text-red-500">
                          {errors.camera_model.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="focal_length" className="text-base">
                        Focal Length (mm)
                      </Label>
                      <Input
                        {...register("focal_length")}
                        type="number"
                        id="focal_length"
                        className="col-span-2 h-10"
                        defaultValue={photo?.exif_focal_length ?? ""}
                      />
                      {errors?.focal_length && (
                        <p className="text-sm text-red-500">
                          {errors.focal_length.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="aperture" className="text-base">
                        Aperture (ƒ)
                      </Label>
                      <Input
                        {...register("aperture")}
                        id="aperture"
                        className="col-span-2 h-10"
                        defaultValue={photo?.exif_aperture_value ?? ""}
                      />
                      {errors?.aperture && (
                        <p className="text-sm text-red-500">
                          {errors.aperture.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="iso" className="text-base">
                        ISO
                      </Label>
                      <Input
                        {...register("iso")}
                        id="iso"
                        className="col-span-2 h-10"
                        defaultValue={photo?.exif_iso ?? ""}
                      />
                      {errors?.iso && (
                        <p className="text-sm text-red-500">
                          {errors.iso.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="speed" className="text-base">
                        Shutter Speed (s)
                      </Label>
                      <Input
                        {...register("speed")}
                        id="speed"
                        className="col-span-2 h-10"
                        defaultValue={photo?.exif_exposure_time ?? ""}
                      />
                      {errors?.speed && (
                        <p className="text-sm text-red-500">
                          {errors.speed.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 flex items-center gap-8">
                  <Button variant={"outline"} onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update details
                    {isLoading && (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            ) : selected === "tags" ? (
              <>
                <div className="flex flex-col w-full h-full gap-2 px-4 py-6">
                  <Label className="text-base">Tags</Label>
                  <TagsInput photoId={photoId} />
                </div>
              </>
            ) : selected === "feature" ? (
              <div className="flex flex-col w-full h-full gap-2 px-4 py-6">
                <div className="flex flex-col">
                  <Label className="text-base">Feature</Label>
                  <p className="text-sm text-muted-foreground">
                    Maximum 4 features
                  </p>
                </div>
                <FeatureForm photoId={photoId} />
              </div>
            ) : (
              <div className="px-4 py-6">
                <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-md shadow-sm">
                  <span className="text-xl font-semibold">Delete image</span>
                  <span className="text-sm text-gray-500 leading-6">
                    When an image is deleted from Punplash, we will do
                    everything we can to prevent its further distribution,
                    including preventing it from being viewed and downloaded
                    through Unsplash. However, the{" "}
                    <Link href={"/"} className="font-medium text-black">
                      Punsplash License
                    </Link>{" "}
                    is irrevocable, so copies of the image that were downloaded
                    before deletion may still be used.
                  </span>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={"destructive"}>
                        I&apos;d like to delete this image
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDelete}
                          className={buttonVariants({ variant: "destructive" })}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPhoto;
