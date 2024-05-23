"use client";

import { Copy, Facebook, Forward, Share } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icons } from "../Icons";
import Link from "next/link";
import {
  FacebookIcon,
  FacebookShareButton,
  XIcon,
  TwitterShareButton,
} from "react-share";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { absoluteUrl } from "@/lib/utils";

const SharePopover = () => {
  const url = usePathname();

  const copylink = () => {
    navigator.clipboard.writeText(absoluteUrl(url));
    toast.success("Copied.");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="shadow-md">
          <Forward className="w-4 h-4 mr-1" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="end">
        <FacebookShareButton
          hashtag="#ShareIntoPunplash"
          url={
            "https://unsplash.com/photos/a-tray-of-roasted-carrots-and-potatoes-KxUIupj29iU"
          }
          className="w-full"
        >
          <Button variant={"ghost"} className="w-full">
            <FacebookIcon size={26} round />
            <span className="text-sm ml-1.5">Facebook</span>
          </Button>
        </FacebookShareButton>

        <TwitterShareButton
          url={
            "https://unsplash.com/photos/a-tray-of-roasted-carrots-and-potatoes-KxUIupj29iU"
          }
          className="w-full"
        >
          <Button variant={"ghost"} className="w-full">
            <XIcon size={26} />
            <span className="text-sm ml-1.5">X</span>
          </Button>
        </TwitterShareButton>

        <Separator />

        <Button variant={"ghost"} className="w-full" onClick={copylink}>
          <Copy className="w-4 h-4 mr-1.5" />
          Copy link
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;
