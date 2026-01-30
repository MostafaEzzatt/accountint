export const splitIntoTens = (arr: Array<string>) => {
  const result = [];
  for (let i = 0; i < arr.length; i += 10) {
    result.push(arr.slice(i, i + 10));
  }
  return result;
};
