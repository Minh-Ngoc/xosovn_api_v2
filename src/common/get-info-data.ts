export const getSelectData = <T extends Record<string, any>>(
  select: (keyof T)[] = [],
) => {
  return Object.fromEntries(select.map((element) => [element, 1]));
};
