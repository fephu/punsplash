import { Bell, Ghost } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { fetchRedis } from "@/helpers/redis";
import { getAuthSession } from "@/lib/auth";
import { User } from "next-auth";
import FollowingRequest from "./FollowingRequest";
import { db } from "@/db";

interface BellNotificationProps {
  unseenNotificationCount: number;
}

const BellNotification = async ({
  unseenNotificationCount,
}: BellNotificationProps) => {
  const session = await getAuthSession();

  const idToAdd = (await fetchRedis(
    "get",
    `user:email:${session?.user.email}`
  )) as string;

  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${idToAdd}:incoming_friend_requests`
  )) as string[];

  const incomingFollowRequest = await Promise.all(
    incomingSenderIds.map(async (senderId: any) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return {
        senderId,
        senderImage: senderParsed?.image,
        senderName: senderParsed?.name,
      } as IncomingFollowRequest;
    })
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"}>
          <Bell />
          {unseenNotificationCount > 0 && (
            <div className="rounded-full w-5 h-5 text-xs bg-red-500 text-white flex items-center justify-center">
              {unseenNotificationCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[25rem] h-[25rem]">
        <FollowingRequest
          incomingFollowRequest={incomingFollowRequest}
          sessionId={idToAdd}
        />
      </PopoverContent>
    </Popover>
  );
};

export default BellNotification;
