import { type Image, loadImage, createCanvas } from 'canvas';
import { createLinearGradient } from '~/features/compose-frame/utils/createLinearGradient';

export const changeImageColor = async (img: Image, size: number, colors: readonly string[]): Promise<Image> => {
  const cv = createCanvas(size, size);
  const ctx = cv.getContext('2d');

  ctx.fillStyle = createLinearGradient(ctx, size, colors);
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'destination-atop';
  ctx.drawImage(img, 0, 0, size, size);

  return loadImage(cv.toDataURL('image/png'));
};
