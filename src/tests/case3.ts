import { parallelWaterfall } from '../parallelWaterfall';

const forn = (n: number, cb: (i: number) => void) => {
  for (let i = 0; i < n; ++i) {
    cb(i);
  }
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let startT = null;

const genTask = (id: string | number, ms = 1000, throws = false) => async (
  data: any
) => {
  if (!startT) startT = Date.now();
  const delta = Math.round((Date.now() - startT) / 1000);
  const name = 'task' + id;
  console.log(delta + 's: starting', name, data);
  await delay(ms);
  if (throws) throw new Error(name + ' error with ' + data);
  return data.map((s) => s + '-' + name);
};

const N = 4;
const T = 4;
const K = 1;

const data = [];
forn(N, (i) => data.push('data' + i));
const tasks = [];
forn(T - 2, (i) => tasks.push(genTask(i, 1000 * (i + 1))));
tasks.push({ task: genTask(T - 2), options: { cancellable: false } });
tasks.push({ task: genTask(T - 1, 1000, true) });

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
