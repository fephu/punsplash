"use client";

import { X } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const CloseButton = () => {
  const router = useRouter();
  return (
    <Button
      size={"sm"}
      variant={"ghost"}
      onClick={() => router.back()}
      className="sticky top-0 z-50 text-white hover:bg-black/60 hover:text-gray-200"
    >
      <X className="w-6 h-6" />
    </Button>
  );
};

export default CloseButton;
