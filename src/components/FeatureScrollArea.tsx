"use client";

import { trpc } from "@/app/_trpc/client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useEffect, useRef } from "react";
import { nullable } from "zod";
import { Feature } from "@prisma/client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface FeatureScrollAreaProps {
  allFeatures: Feature[];
}

const FeatureScrollArea = ({ allFeatures }: FeatureScrollAreaProps) => {
  return (
    <ScrollArea>
      <div className="py-2 flex items-center justify-center gap-8">
        {allFeatures?.map((feature: Feature) => (
          <Link
            key={feature.id}
            href={`/t/${feature.value}`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {feature.name}
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default FeatureScrollArea;
