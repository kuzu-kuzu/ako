import { loadImage, createCanvas } from 'canvas';
import type { ImageSource } from '~/features/compose-frame/types/ImageSource';
import { SIZE } from '~/features/compose-frame/const/SIZE';
import type { ComposeFrameOptions } from '~/features/compose-frame/types/ComposeFrameOptions';
import { changeImageColor } from '~/features/compose-frame/utils/changeImageColor';
import { createLinearGradient } from '~/features/compose-frame/utils/createLinearGradient';
import { getCompactFrameImages } from '~/features/compose-frame/utils/getCompactFrameCovers';

export const RESIZE_RATE = 0.68;
export const INNER_ARC_SIZE_RATE = 0.7407407407407408;

export const halfSize = SIZE / 2;
export const innerArcSize = SIZE * INNER_ARC_SIZE_RATE;
export const innerArcHalfSize = innerArcSize / 2;
export const center = halfSize - innerArcHalfSize;
export const innerArcCenter = center + innerArcHalfSize;

export const composeCompactFrame = async (
  src: ImageSource,
  {
    accentColors,
    backgroundColors,
    backgroundOnly = false
  }: ComposeFrameOptions
): Promise<Buffer> => {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');
  const images = await getCompactFrameImages();
  const accentGradient = createLinearGradient(ctx, accentColors);
  const backgroundGradient = createLinearGradient(ctx, backgroundColors);

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
    await changeImageColor(images.circleCover, backgroundGradient),
    0, 0
  );
  ctx.drawImage(
    await changeImageColor(images.leftFangCover, backgroundGradient),
    87, 60
  );
  ctx.drawImage(
    await changeImageColor(images.rightFangCover, backgroundGradient),
    147, 60
  );
  ctx.drawImage(
    await changeImageColor(images.symbolCover, backgroundGradient),
    80, 10
  );

  if (!backgroundOnly) {
    ctx.drawImage(
      await changeImageColor(images.frame, accentGradient),
      0, 0
    );
  }

  return cv.toBuffer('image/png');
};
