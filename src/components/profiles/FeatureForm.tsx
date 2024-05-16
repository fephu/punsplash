"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Check, CircleHelp, Loader2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FeatureFormProps {
  photoId: string;
}

const FeatureForm = ({ photoId }: FeatureFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const utils = trpc.useContext();

  const { data: features, isLoading } =
    trpc.photoRouter.getFeatureOfPhoto.useQuery({
      id: photoId,
    });

  const { mutate: addFeature } = trpc.photoRouter.addFeatureToPhoto.useMutation(
    {
      onSuccess: () => {
        utils.photoRouter.getFeatureOfPhoto;
      },
    }
  );

  const { mutate: removeFeature } =
    trpc.photoRouter.removeFeatureToPhoto.useMutation({
      onSuccess: () => {
        utils.photoRouter.getFeatureOfPhoto;
      },
    });

  const { data: allFeatures } = trpc.featureRouter.getAllFeature.useQuery();

  const isChosen = (featureId: string) => {
    return !!features?.find((f) => f.id === featureId);
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          {features?.map((feature, i) => (
            <div className="border text-base rounded-md px-2 py-1 flex items-center">
              {feature.name}
              <X
                className="w-2.5 h-2.5 ml-1.5 hover:cursor-pointer"
                onClick={() =>
                  removeFeature({
                    photoId,
                    featureId: feature.id,
                  })
                }
              />
            </div>
          ))}
        </div>
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Choose a feature"
            type="text"
            className="text-base"
            onClick={() => setIsOpen(!isOpen)}
          />

          {value.length > 0 && (
            <X
              className="absolute top-3.5 right-3 w-3 h-3 ml-1.5"
              onClick={() => setValue("")}
            />
          )}

          {isOpen && (
            <div className="absolute inset-x-0 h-60 overflow-y-scroll bg-white border border-gray-200 rounded-md w-full">
              <div className="text-sm text-gray-400 px-4 py-2 flex items-center">
                <CircleHelp className="w-4 h-4 mr-1.5" />
                <span>Click to add</span>
              </div>
              <div className="flex flex-col">
                {allFeatures &&
                  allFeatures.map((feature) => (
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        addFeature({ photoId, featureId: feature.id })
                      }
                      disabled={isChosen(feature.id)}
                      className={isChosen(feature.id) ? "bg-gray-200" : ""}
                    >
                      {feature.name}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeatureForm;
