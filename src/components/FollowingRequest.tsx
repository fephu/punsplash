"use client";

import { Check, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FollowingRequestProps {
  incomingFollowRequest: IncomingFollowRequest[];
  sessionId: string;
}

const FollowingRequest = ({
  incomingFollowRequest,
  sessionId,
}: FollowingRequestProps) => {
  const router = useRouter();
  const [followRequest, setFollowRequest] = useState<IncomingFollowRequest[]>(
    incomingFollowRequest
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const followRequestHandler = ({
      senderId,
      senderImage,
      senderName,
    }: IncomingFollowRequest) => {
      setFollowRequest((prev) => [
        ...prev,
        { senderId, senderImage, senderName },
      ]);
    };

    pusherClient.bind("incoming_friend_requests", followRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", followRequestHandler);
    };
  }, []);

  const accecptFollow = async (senderId: string) => {
    await axios.post("/api/follow/accept", { id: senderId });

    setFollowRequest((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {followRequest.length === 0 ? (
        <p>Nothing to show here...</p>
      ) : (
        followRequest.map((request: any) => (
          <div
            key={request.senderId}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2 mr-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={request.senderImage ?? ""} />
              </Avatar>
              <p className="font-medium text-sm text-black">
                <span className="font-semibold">{request.senderName}</span> sent
                a request to follow you.
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size={"sm"}
                className="px-2 py-0 text-xs h-6"
                onClick={() => accecptFollow(request.senderId)}
              >
                Accept
              </Button>
              <Button
                variant={"destructive"}
                size={"sm"}
                className="px-2 py-0 text-xs h-6"
              >
                Deny
              </Button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FollowingRequest;
