import { CanvasGradient, type CanvasRenderingContext2D } from 'canvas';
import parseCssColor from 'parse-css-color';

export const createLinearGradient = (ctx: CanvasRenderingContext2D, size: number, colors: readonly string[]): CanvasGradient => {
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  const step = 1 / (colors.length - 1);

  for (const [i, color] of colors.entries()) {
    if (!parseCssColor(color)) {
      throw new Error(`Failed to execute 'addColorStop' on 'CanvasGradient': The value provided ('${color}') could not be parsed as a color.`);
    }

    gradient.addColorStop(step * i, color);
  }

  return gradient;
};
