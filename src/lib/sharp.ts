import sharp from "sharp";

export async function processImage(inputPath: string): Promise<void> {
  try {
    const image = sharp(inputPath);

    // Lấy thông tin kích thước ảnh
    const metadata = await image.metadata();
    console.log(`Width: ${metadata.width}, Height: ${metadata.height}`);

    console.log("Image processed successfully");
  } catch (err) {
    console.error("Error:", err);
  }
}
