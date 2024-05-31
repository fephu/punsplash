import { db, dbRedis } from "@/db";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const emailToAdd = body.email;

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    const session = await getServerSession(authOptions);

    const idUser = (await fetchRedis(
      "get",
      `user:email:${session?.user.email}`
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === idUser) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    // check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    // check if user is already added
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${idUser}:following`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 });
    }

    // valid request, send friend request

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: idUser,
        senderName: session.user.name,
        senderImage: session.user.image,
      }
    );

    await dbRedis.sadd(`user:${idToAdd}:incoming_friend_requests`, idUser);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
