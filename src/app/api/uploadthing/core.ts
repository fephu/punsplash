import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  photoUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const session = await getAuthSession();
      const user = session?.user;

      if (!user || !user.id) throw Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // const net = await cocoSSDLoad();

      // const response = await fetch(file.url);
      // const blob = await response.blob();
      // const imageElement = await createImageBitmap(blob);

      // const tensor = tf.browser.fromPixels(imageElement);

      // const predictions = await net.detect(tensor);

      // predictions.forEach((prediction) => {
      //   console.log(
      //     `Đối tượng: ${
      //       prediction.class
      //     }, Độ tin cậy: ${prediction.score.toFixed(2)}, Vị trí: ${
      //       prediction.bbox
      //     }`
      //   );
      // });

      // processImage("/6.jpg");
      const createdPhoto = await db.photo.create({
        data: {
          userId: metadata.userId,
          url: file.url,
          statDownload: 0,
          statViews: 0,

          // url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        },
      });
    }),
  imageProfile: f({ image: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const session = await getAuthSession();
      const user = session?.user;

      if (!user || !user.id) throw Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          image: file.url,
        },
      });
    }),
  imageBlog: f({ image: { maxFileSize: "4MB" } })
    .middleware(async (req) => {
      const session = await getAuthSession();
      const user = session?.user;

      if (!user || !user.id) throw Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
