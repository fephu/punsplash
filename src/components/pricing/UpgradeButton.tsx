"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { Button } from "../ui/button";

const UpgradeButton = () => {
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href = url ?? "/billing";
      },
    });

  return (
    <Button onClick={() => createStripeSession()} className="w-full">
      Get
      <span className="ml-1.5 text-blue-500 font-semibold">Punplash+</span>{" "}
      {isLoading ? (
        <Loader2 className="w-4 h-4 ml-1.5 animate-spin" />
      ) : (
        <ArrowRight className="h-4 w-4 ml-1.5" />
      )}
    </Button>
  );
};

export default UpgradeButton;
