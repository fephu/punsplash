import { ImageIcon, ImagePlus, ScanSearch } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import Image from "next/image";

const VisualSearch = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="absolute top-1 right-0.5"
          variant={"ghost"}
          size={"sm"}
        >
          <ScanSearch className="w-6 h-6" />
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
          <div className="border-dashed border-2 border-gray-400 w-full h-80 rounded-md flex items-center justify-center">
            <ImagePlus className="w-6 h-6" />
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
