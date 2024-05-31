"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import { ImageIcon, ImagePlus, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { trpc } from "@/app/_trpc/client";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface UploadDropzoneProps {
  username: string;
}

const UploadDropzone = ({ username }: UploadDropzoneProps) => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean | null>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload } = useUploadThing("photoUploader");

  const { mutate: startPolling } = trpc.getPhoto.useMutation({
    onSuccess: () => {
      router.push(`/profile/${username}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress > 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const accepted = {
    "image/*": [".jpeg", ".jpg", ".png"],
  };

  return (
    <Dropzone
      accept={accepted}
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        // handle file uploading
        const res = await startUpload(acceptedFile);

        if (!res) {
          return toast.error("Something went wrong. Please try again");
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
          toast.error("Something went wrong. Please try again");
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImagePlus className="h-8 w-8 text-zinc-500 mb-2" />
                <p className="mb-2 text-base text-zinc-700">
                  <span className="font-semibold text-blue-500">
                    Click to Upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm text-zinc-500">JPEG only (up to 16MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              /> */}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

interface UploadDialogProps {
  username: string;
}

const UploadDialog = ({ username }: UploadDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant={"outline"} size={"sm"}>
          Submit a photo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone username={username} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
