import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { profileRouter } from "./profile-router";
import { collectionRouter } from "./collection-router";
import { featureRouter } from "./feature-router";
import { photoRouter } from "./photo-router";
export const appRouter = router({
  profileRouter: profileRouter,
  collectionRouter: collectionRouter,
  featureRouter: featureRouter,
  photoRouter: photoRouter,
  getPhoto: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const photo = await db.photo.findFirst({
        where: {
          userId,
        },
      });

      if (!photo) throw new TRPCError({ code: "NOT_FOUND" });

      return photo;
    }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      return await db.user.findFirst({
        where: {
          id: userId,
        },
      });
    }),
  isLiked: publicProcedure
    .input(z.object({ photoId: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      const { photoId, userId } = input;
      return await db.likedPhoto.findFirst({
        where: {
          photoId,
          userId,
        },
      });
    }),
  countPhotoOfCollection: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      const { collectionId } = input;

      return await db.photoCollection.count({
        where: {
          collectionId,
        },
      });
    }),
  getCollectionByPhotoId: privateProcedure
    .input(z.object({ photoId: z.string() }))
    .query(async ({ input }) => {
      const { photoId } = input;

      return await db.photoCollection.findMany({
        where: {
          photoId,
        },
      });
    }),
  addPhotoToCollection: privateProcedure
    .input(z.object({ photoId: z.string(), collectionId: z.string() }))
    .mutation(async ({ input }) => {
      const { photoId, collectionId } = input;

      await db.photoCollection.create({
        data: {
          photoId,
          collectionId,
        },
      });
      return { success: true };
    }),
  deletePhotoToCollection: privateProcedure
    .input(z.object({ photoId: z.string(), collectionId: z.string() }))
    .mutation(async ({ input }) => {
      const { photoId, collectionId } = input;

      await db.photoCollection.delete({
        where: {
          photoId_collectionId: {
            photoId,
            collectionId,
          },
        },
      });
      return { success: true };
    }),
  getAllCollectionsOfUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await db.collection.findMany({
        where: {
          userId,
        },
      });
    }),
  getPhotoByPhotoId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      return await db.photo.findFirst({
        where: { id },
      });
    }),
  checkPhotoInCollections: privateProcedure
    .input(z.object({ photoId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { photoId } = input;
      const { userId } = ctx;

      const collections = await db.photoCollection.findMany({
        where: {
          photoId,
          Collection: {
            userId,
          },
        },
      });

      return collections;
    }),
  addNewCollection: privateProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        isPrivate: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, subtitle, isPrivate } = input;
      const { userId } = ctx;

      await db.collection.create({
        data: {
          title,
          subtitle,
          userId,
          isPrivate,
        },
      });

      return { success: true };
    }),
  likePhoto: privateProcedure
    .input(z.object({ photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { photoId } = input;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.likedPhoto.create({
        data: {
          photoId,
          userId,
        },
      });

      return { success: true };
    }),
  unikePhoto: privateProcedure
    .input(z.object({ photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { photoId } = input;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.likedPhoto.delete({
        where: {
          photoId_userId: {
            photoId,
            userId,
          },
        },
      });

      return { success: true };
    }),
  countPhoto: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const count = await db.photo.count({
        where: {
          userId,
        },
      });

      return count;
    }),
  countLikesPhoto: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const count = await db.likedPhoto.count({
        where: {
          userId,
        },
      });

      return count;
    }),
  countCollections: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const count = await db.collection.count({
        where: {
          userId,
        },
      });

      return count;
    }),
  countCollectionsPrivate: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const count = await db.collection.count({
        where: {
          userId,
          isPrivate: true,
        },
      });

      return count;
    }),
  getAllPhotosOrderByStatDownloads: publicProcedure.query(async () => {
    return await db.photo.findMany({
      orderBy: [
        {
          statDownload: "desc",
        },
      ],
    });
  }),
  get3PhotosPopularOfUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const photos = await db.photo.findMany({
        where: {
          userId,
        },
        orderBy: {
          statViews: "desc",
        },
        take: 3,
      });

      return photos;
    }),
  countSearch: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const { key } = input;

      const countPhoto = await db.photo.count({
        where: {
          Keyword: {
            some: {
              keyword: {
                contains: key,
              },
            },
          },
        },
      });

      const countCollection = await db.collection.count({
        where: {
          title: {
            contains: key,
          },
        },
      });

      const countUser = await db.user.count({
        where: {
          name: {
            contains: key,
          },
        },
      });

      return { countPhoto, countCollection, countUser };
    }),
});
export type AppRouter = typeof appRouter;
