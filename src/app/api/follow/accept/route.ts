import { dbRedis } from "@/db";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const idUser = (await fetchRedis(
      "get",
      `user:email:${session?.user.email}`
    )) as string;

    // verify both users are not already friend
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${idUser}:follower`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friend", { status: 400 });
    }

    const hasFollowRequest = await fetchRedis(
      "sismember",
      `user:${idUser}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFollowRequest) {
      return new Response("No friend request", { status: 400 });
    }

    await dbRedis.sadd(`user:${idToAdd}:following`, idUser);

    await dbRedis.srem(`user:${idUser}:incoming_friend_requests`, idToAdd);

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Invalid request", { status: 400 });
  }
}
