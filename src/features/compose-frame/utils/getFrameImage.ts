import { type Image, loadImage } from 'canvas';

export const FRAME_IMAGE_URL = 'https://cdn.discordapp.com/attachments/906420165204402180/908012012808847360/frm-skl.png';

export let cachedFrameImage: Image | undefined;

export const getFrameImage = async (): Promise<Image> => {
  if (cachedFrameImage) {
    return cachedFrameImage;
  }

  const frameImage = await loadImage(FRAME_IMAGE_URL);

  cachedFrameImage = frameImage;

  return frameImage;
};
