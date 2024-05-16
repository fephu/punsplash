import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
export const featureRouter = router({
  getAllPhotoByFeature: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const photos = await db.photo.findMany({
        where: {
          PhotoFeature: {
            some: {
              featureId: id,
            },
          },
        },
      });

      if (!photos) throw new TRPCError({ code: "NOT_FOUND" });

      return photos;
    }),
  getAllFeature: publicProcedure.query(async () => {
    const features = await db.feature.findMany({});

    return features;
  }),
});
export type FeatureRouter = typeof featureRouter;
