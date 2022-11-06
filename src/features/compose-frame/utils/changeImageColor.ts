import { type Image, loadImage, createCanvas, CanvasGradient } from 'canvas';
import { createLinearGradient } from '~/features/compose-frame/utils/createLinearGradient';

export const changeImageColor = async (
  img: Image,
  colors: CanvasGradient | readonly string[],
  [width, height]: readonly [width: number, height: number] = [img.naturalWidth, img.naturalHeight],
): Promise<Image> => {
  const cv = createCanvas(width, height);
  const ctx = cv.getContext('2d');

  ctx.fillStyle = colors instanceof CanvasGradient ? colors : createLinearGradient(ctx, colors);
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'destination-atop';
  ctx.drawImage(img, 0, 0, width, height);

  return loadImage(cv.toDataURL('image/png'));
};
