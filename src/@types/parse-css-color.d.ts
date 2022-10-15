declare module 'parse-css-color' {
  type ColorType = 'hsl' | 'rgb';
  type Color = Readonly<{
    alpha: number,
    type: ColorType,
    values: readonly [number, number, number]
  }>;

  const parseCssColor: (str: string) => Color | null;

  export default parseCssColor;
  export {
    type Color,
    type ColorType
  };
}
