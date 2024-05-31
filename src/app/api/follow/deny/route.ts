import { dbRedis } from "@/db";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    const idUser = (await fetchRedis(
      "get",
      `user:email:${session?.user.email}`
    )) as string;

    if (!session) {
      return new Response("Unauthozied", { status: 401 });
    }

    await dbRedis.srem(`user:${idUser}:incoming_friend_requests`, idToDeny);

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Invalid request", { status: 400 });
  }
}
