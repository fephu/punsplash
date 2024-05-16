"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const CloseModal = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="close modal"
      onClick={() => router.back()}
      className="h-6 w-6 p-0 rounded-md"
      variant={"ghost"}
      size={"sm"}
    >
      <X className="w-4 h-4" />
    </Button>
  );
};

export default CloseModal;
