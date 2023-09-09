import { parallelWaterfall } from '../parallelWaterfall';

const forn = (n: number, cb: (i: number) => void) => {
  for (let i = 0; i < n; ++i) {
    cb(i);
  }
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let startT = null;

let c = 0;
const genTask = (id, ms = 1000) => async (data: any) => {
  if (!startT) startT = Date.now();
  const delta = Math.round((Date.now() - startT) / 1000);
  const name = 'task' + id;
  console.log(delta + 's: starting', name, data);
  await delay(ms);
  if (id === 2) c++;
  if (id === 2 && c === 2) throw new Error('task 2 error' + data);
  return data.map((s) => s + '-' + name);
};

const N = 5;
const T = 4;
const K = 1;

const data = [];
forn(N, (i) => data.push('data' + i));
const tasks = [];
forn(T, (i) => tasks.push(genTask(i, 1000 * (i + 1))));

const breakArr = (arr: any[], size: number) => {
  const res = [];
  let i = 0;
  while (i < arr.length) {
    res.push(arr.slice(i, i + size));
    i += size;
  }
  return res;
};

export const test = async () => {
  const batchedInput = breakArr(data, K);
  try {
    const res = await parallelWaterfall(batchedInput, tasks);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
};
