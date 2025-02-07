export const repeatFunction = (n: number, cb: (i: number) => void) => {
  for (let i = 0; i < n; ++i) {
    cb(i);
  }
};

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));


export const splitInBatches = (arr: any[], batchSize: number) => {
  const res = [];
  let i = 0;
  while (i < arr.length) {
    res.push(arr.slice(i, i + batchSize));
    i += batchSize;
  }
  return res;
};
