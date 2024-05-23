import { Cat, ChevronDown, Earth, Instagram } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { XIcon } from "react-share";

interface ConnectWithProps {
  username: string;
  insUsername?: string;
  xUsername?: string;
  portfolio?: string;
}

const ConnectWith = ({
  username,
  insUsername,
  xUsername,
  portfolio,
}: ConnectWithProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="p-0 text-base">
          <Cat className="w-4 h-4 mr-2" />
          Connect with {username}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <div className="flex flex-col">
          {portfolio && (
            <Link href={portfolio}>
              <Earth />
              {portfolio}
            </Link>
          )}
          {insUsername && (
            <Link
              href={"https://www.instagram.com/" + insUsername}
              className="flex items-center hover:bg-neutral-200 px-4 py-2"
              target="_blank"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Link>
          )}
          {xUsername && (
            <Link
              href={"https://x.com/" + xUsername}
              className="flex items-center hover:bg-neutral-200 px-4 py-2"
              target="_blank"
            >
              <XIcon className="w-4 h-4 mr-2" />X
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConnectWith;
