"use client";

import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { Button } from "../ui/button";

const UpgradeButton = () => {
  //   const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
  //     onSuccess: ({ url }) => {
  //       window.location.href = url ?? "/billing";
  //     },
  //   });

  return (
    <Button className="w-full">
      Get
      <span className="ml-1.5 text-blue-500 font-semibold">Premium</span>{" "}
      <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
