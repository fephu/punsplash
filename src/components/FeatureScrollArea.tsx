"use client";

import { trpc } from "@/app/_trpc/client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useEffect, useRef } from "react";
import { nullable } from "zod";
import { Feature } from "@prisma/client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface FeatureScrollAreaProps {
  allFeatures: Feature[];
}

const FeatureScrollArea = ({ allFeatures }: FeatureScrollAreaProps) => {
  return (
    // <ScrollArea>
    //   <div className="px-4 py-2 flex items-center justify-center gap-8">
    //     {allFeatures?.map((feature: Feature) => (
    //       <Link
    //         key={feature.id}
    //         href={`/t/${feature.value}`}
    //         className={buttonVariants({ variant: "ghost", size: "sm" })}
    //       >
    //         {feature.name}
    //       </Link>
    //     ))}
    //   </div>
    //   <ScrollBar orientation="horizontal" />
    // </ScrollArea>
    <Carousel className="ml-12 w-[80%] lg:w-[78%] h-full">
      <CarouselContent className="">
        {allFeatures &&
          allFeatures.map((feature: Feature) => (
            <CarouselItem key={feature.id} className="pl-1 basis-1/9 px-4 py-2">
              <Link
                href={`/t/${feature.value}`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {feature.name}
              </Link>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FeatureScrollArea;
