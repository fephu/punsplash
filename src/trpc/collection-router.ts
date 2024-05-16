import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";

export const collectionRouter = router({
  getCollectionById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      return await db.collection.findFirst({
        where: { id },
      });
    }),
  getAllCollections: publicProcedure.query(async () => {
    return await db.collection.findMany({
      where: {
        isPrivate: false,
      },
    });
  }),
  getPhotoOfCollection: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      return await db.photo.findMany({
        where: {
          PhotoCollection: {
            some: {
              collectionId: id,
            },
          },
        },
      });
    }),
  deleteACollection: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { userId } = ctx;

      await db.photoCollection.deleteMany({
        where: {
          collectionId: id,
          Collection: {
            userId,
          },
        },
      });

      await db.collection.deleteMany({
        where: {
          id,
          userId,
        },
      });

      return { success: true };
    }),
  editCollection: privateProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        isPrivate: z.boolean(),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, subtitle, isPrivate, collectionId } = input;
      const { userId } = ctx;

      await db.collection.update({
        data: {
          title,
          subtitle,
          isPrivate,
        },
        where: {
          id: collectionId,
          userId,
        },
      });

      return { success: true };
    }),
  getThirdPhoto: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const photo = await db.photo.findMany({
        where: {
          PhotoCollection: {
            some: {
              collectionId: id,
            },
          },
        },
        take: 3,
      });

      return photo;
    }),
});

export type CollectionRouter = typeof collectionRouter;
