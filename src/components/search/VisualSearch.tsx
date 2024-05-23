import { Copy, Focus, ImageIcon, ImagePlus, ScanSearch } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import Image from "next/image";
import { Input } from "../ui/input";

const VisualSearch = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="absolute top-1 right-0.5"
          variant={"ghost"}
          size={"sm"}
        >
          <Focus className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-[600px] px-4 py-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between py-2">
            <span>Visual Search</span>
            <Link
              href={"/"}
              className={buttonVariants({
                variant: "link",
                className: "underline pr-0",
              })}
            >
              Need help?
            </Link>
          </div>
          <div className="px-24 py-4 border-dashed border-2 border-gray-400 w-full h-80 rounded-md flex flex-col items-center justify-center">
            <ImagePlus className="w-8 h-8 text-muted-foreground" />

            <span className="text-xl font-semibold text-center mt-4">
              Drag and drop your image here or{" "}
              <span className="text-blue-700 font-bold">Browse</span> to choose
              a file
            </span>
            <span className="my-4 text-lg text-muted-foreground">or</span>
            <div className="relative">
              <Input
                placeholder="Past an image or a URL"
                className="pl-10 rounded-full shadow-sm"
              />
              <Copy className="absolute top-3 left-4 w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col items-center py-6">
            <span className="text-sm">Or try one of the examples below:</span>
            <div className="flex items-center gap-2 py-6">
              <Image
                src={
                  "https://utfs.io/f/b39cdc5f-4781-4acd-a0b6-c1089bbb7dcc-6k0f7o.jpg"
                }
                width={160}
                height={100}
                alt="Visual Image"
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VisualSearch;
