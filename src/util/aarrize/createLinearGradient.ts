import { CanvasGradient, type CanvasRenderingContext2D } from 'canvas';
import parseCssColor from 'parse-css-color';

const DEFAULT_COLORS: readonly string[] = ['#000000', '#c80000'];

const createLinearGradient = (ctx: CanvasRenderingContext2D, size: number, colors?: readonly string[]): CanvasGradient => {
  const resolvedColors: readonly string[] = colors?.length ? colors : DEFAULT_COLORS;
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  const step = 1 / (resolvedColors.length - 1);

  for (const [i, color] of resolvedColors.entries()) {
    if (!parseCssColor(color)) {
      throw new Error(`Failed to execute 'addColorStop' on 'CanvasGradient': The value provided ('${color}') could not be parsed as a color.`);
    }

    gradient.addColorStop(step * i, color);
  }

  return gradient;
};

export {
  DEFAULT_COLORS,
  createLinearGradient
};
