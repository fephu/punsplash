import { z } from "zod";

export const UpdatePhotoValidators = z.object({
  description: z.string(),
  camera_make: z.string(),
  camera_model: z.string(),
  focal_length: z.string(),
  aperture: z.string(),
  iso: z.string(),
  speed: z.string(),
});

export type TUpdatePhotoValidators = z.infer<typeof UpdatePhotoValidators>;
