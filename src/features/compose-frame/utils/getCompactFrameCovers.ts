import { join as joinPath, parse as parsePath } from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { loadImage, type Image } from 'canvas';
import { camelCase } from 'change-case';

export type WritableImages = Record<string, Image>;
export type Images = Readonly<WritableImages>;

export let cachedImages: Images | undefined;
export const imagesDirPath = joinPath(process.cwd(), './src/features/compose-frame/images/');

export const getCompactFrameImages = async (): Promise<Images> => {
  if (cachedImages) {
    return cachedImages;
  }

  const images: WritableImages = {};
  const imageFiles: readonly string[] = await readdir(imagesDirPath);

  for (const file of imageFiles) {
    const data = await readFile(joinPath(imagesDirPath, file));
    const { name } = parsePath(file);
    const image = await loadImage(data);

    images[camelCase(name)] = image;
  }

  cachedImages = images;

  return images;
};
