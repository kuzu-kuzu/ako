import { createCanvas, loadImage } from 'canvas';
import { SIZE } from '../const/SIZE';
import { ComposeFrameOptions } from '../types/ComposeFrameOptions';
import { ImageSource } from '../types/ImageSource';
import { changeImageColor } from './changeImageColor';
import { createLinearGradient } from './createLinearGradient';
import { getUsualFrameImage } from './getUsualFrameImage';

export const MARGIN = 5;
export const INNER_ARC_SIZE_RATE = 0.7407407407407408;

export const halfSize = SIZE / 2;
export const innerArcSize = SIZE * INNER_ARC_SIZE_RATE;
export const innerArcHalfSize = innerArcSize / 2;
export const center = halfSize - innerArcHalfSize;
export const innerArcCenter = center + innerArcHalfSize;

export const composeUsualFrame = async (
  src: ImageSource,
  {
    accentColors,
    backgroundColors,
  }: ComposeFrameOptions
): Promise<Buffer> => {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');

  ctx.beginPath();
  ctx.arc(halfSize, halfSize, halfSize - MARGIN, 0, Math.PI * 2);

  ctx.fillStyle = createLinearGradient(ctx, backgroundColors);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    innerArcCenter, innerArcCenter,
    innerArcHalfSize, 0, Math.PI * 2
  );

  ctx.clip();
  ctx.drawImage(
    await loadImage(src),
    center, center,
    innerArcSize, innerArcSize
  );

  ctx.restore();
  ctx.drawImage(
    await changeImageColor(await getUsualFrameImage(), accentColors),
    0, 0, SIZE, SIZE
  );

  return cv.toBuffer('image/png');
};
