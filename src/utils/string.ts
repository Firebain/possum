export const splitStringAt =
  (index: number) =>
  (str: string): [string, string] =>
    [str.substring(0, index), str.substring(index)];
