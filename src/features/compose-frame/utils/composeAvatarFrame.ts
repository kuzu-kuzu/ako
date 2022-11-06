import { createCanvas, loadImage } from 'canvas';
import { createLinearGradient } from '~/features/compose-frame/utils/createLinearGradient';
import { getFrameImage } from '~/features/compose-frame/utils/getFrameImage';
import { changeImageColor } from './changeImageColor';

export const TAU = Math.PI * 2;
export const MARGIN = 5;
export const SIZE = 256;
export const INNER_ARC_SIZE_RATE = 0.7407407407407408;

export const halfSize = SIZE / 2;
export const innerArcSize = SIZE * INNER_ARC_SIZE_RATE;
export const innerArcHalfSize = innerArcSize / 2;
export const center = halfSize - innerArcHalfSize;
export const innerArcCenter = center + innerArcHalfSize;

export const composeAvatarFrame = async (src: Buffer | string, accentColors: readonly string[], bgColors: readonly string[]): Promise<Buffer> => {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');

  ctx.beginPath();
  ctx.arc(halfSize, halfSize, halfSize - MARGIN, 0, TAU);

  ctx.fillStyle = createLinearGradient(ctx, SIZE, bgColors);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    innerArcCenter, innerArcCenter,
    innerArcHalfSize, 0, TAU
  );

  ctx.clip();
  ctx.drawImage(
    await loadImage(src),
    center, center,
    innerArcSize, innerArcSize
  );

  ctx.restore();
  ctx.drawImage(
    await changeImageColor(await getFrameImage(), SIZE, accentColors),
    0, 0, SIZE, SIZE
  );

  return cv.toBuffer('image/png');
};
