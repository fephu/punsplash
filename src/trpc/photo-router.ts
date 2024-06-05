import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
export const photoRouter = router({
  deleteImage: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { userId } = ctx;

      await db.photoCollection.deleteMany({
        where: {
          photoId: id,
        },
      });

      await db.keyword.deleteMany({
        where: {
          photoId: id,
        },
      });

      await db.photoFeature.deleteMany({
        where: {
          photoId: id,
        },
      });

      await db.photo.delete({
        where: { id, userId },
      });

      return { success: true };
    }),
  get20PhotoRelated: publicProcedure.query(async () => {
    const photos = await db.photo.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });

    return photos;
  }),
  getAllTagsOfPhoto: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const tags = await db.keyword.findMany({
        where: {
          photoId: id,
        },
      });

      return tags;
    }),
  uploadPhoto: privateProcedure
    .input(
      z.object({
        photoId: z.string(),
        description: z.string(),
        camera_make: z.string(),
        camera_model: z.string(),
        focal_length: z.string(),
        aperture: z.string(),
        iso: z.string(),
        speed: z.string(),
        country: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        photoId,
        description,
        camera_make,
        camera_model,
        focal_length,
        aperture,
        iso,
        speed,
        country,
      } = input;

      const splitCountry = country.split(", ");

      const city = splitCountry[0];
      const c = splitCountry[1];

      const { userId } = ctx;

      await db.photo.update({
        where: {
          id: photoId,
          userId,
        },
        data: {
          description,
          exif_camera_make: camera_make,
          exif_camera_model: camera_model,
          exif_focal_length: parseFloat(focal_length),
          exif_aperture_value: parseFloat(aperture),
          exif_iso: parseInt(iso),
          exif_exposure_time: speed,
          photo_location_city: city,
          photo_location_country: c,
        },
      });

      return { success: true };
    }),
  getFeatureOfPhoto: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const features = await db.feature.findMany({
        where: {
          PhotoFeature: {
            some: {
              photoId: id,
            },
          },
        },
      });

      return features;
    }),
  addTags: privateProcedure
    .input(
      z.object({
        tag: z.string(),
        photoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { tag, photoId } = input;

      await db.keyword.create({
        data: {
          photoId,
          keyword: tag,
          suggestedByUser: true,
        },
      });

      return { success: true };
    }),
  removeTags: privateProcedure
    .input(
      z.object({
        tag: z.string(),
        photoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { tag, photoId } = input;

      await db.keyword.delete({
        where: {
          photoId_keyword: {
            keyword: tag,
            photoId,
          },
        },
      });

      return { success: true };
    }),
  addFeatureToPhoto: publicProcedure
    .input(z.object({ photoId: z.string(), featureId: z.string() }))
    .mutation(async ({ input }) => {
      const { photoId, featureId } = input;

      await db.photoFeature.create({
        data: {
          featureId,
          photoId,
        },
      });

      return { success: true };
    }),
  removeFeatureToPhoto: publicProcedure
    .input(z.object({ photoId: z.string(), featureId: z.string() }))
    .mutation(async ({ input }) => {
      const { photoId, featureId } = input;

      await db.photoFeature.delete({
        where: {
          photoId_featureId: {
            featureId,
            photoId,
          },
        },
      });

      return { success: true };
    }),
  getFollowingPhotos: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const photos = await db.photo.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return photos;
    }),
});
export type PhotoRouter = typeof photoRouter;
