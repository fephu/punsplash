import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
export const profileRouter = router({
  getUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user;
  }),
  getUserPhotos: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const photos = await db.photo.findMany({
        where: {
          userId,
        },
      });

      return photos;
    }),
  getUserLikesPhotos: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const photos = await db.photo.findMany({
        where: {
          LikePhoto: {
            some: {
              userId,
            },
          },
        },
      });

      return photos;
    }),
  deleteAPhoto: privateProcedure
    .input(z.object({ photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { photoId } = input;

      await db.photo.delete({
        where: {
          id: photoId,
          userId,
        },
      });

      return { success: true };
    }),
  updateHiring: privateProcedure
    .input(z.object({ hire: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { hire } = input;

      await db.user.update({
        data: {
          isHired: hire,
        },
        where: {
          id: userId,
        },
      });

      return { success: true };
    }),
  updatingProfile: privateProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        location: z.string(),
        portfolio: z.string(),
        bio: z.string(),
        insUsername: z.string(),
        xUsername: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        username,
        location,
        portfolio,
        bio,
        insUsername,
        xUsername,
      } = input;
      const { userId } = ctx;

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          username,
          location,
          portfolio,
          bio,
          insUsername,
          xUsername,
        },
      });

      return { success: true };
    }),
});
export type ProfileRouter = typeof profileRouter;
