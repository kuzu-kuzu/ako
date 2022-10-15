import { createCanvas, loadImage } from 'canvas';
import { createLinearGradient } from '~/util/aarrize/createLinearGradient';
import { getFrameImage } from '~/util/aarrize/getFrameImage';

const TAU = Math.PI * 2;
const MARGIN = 5;
const SIZE = 256;
const INNER_ARC_SIZE_RATE = 0.7407407407407408;

const halfSize = SIZE / 2;
const innerArcSize = SIZE * INNER_ARC_SIZE_RATE;
const innerArcHalfSize = innerArcSize / 2;
const center = halfSize - innerArcHalfSize;
const innerArcCenter = center + innerArcHalfSize;

const aarrizeAvatarImage = async (src: Buffer, colors?: readonly string[]): Promise<Buffer> => {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');

  ctx.beginPath();
  ctx.arc(halfSize, halfSize, halfSize - MARGIN, 0, TAU);

  ctx.fillStyle = createLinearGradient(ctx, SIZE, colors);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    innerArcCenter, innerArcHalfSize,
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
    await getFrameImage(),
    0, 0, SIZE, SIZE
  );

  return cv.toBuffer('image/png');
};

export {
  INNER_ARC_SIZE_RATE,
  MARGIN,
  SIZE,
  TAU,
  aarrizeAvatarImage,
  center,
  halfSize,
  innerArcCenter,
  innerArcHalfSize,
  innerArcSize
};
