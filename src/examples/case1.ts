import { parallelWaterfall } from '../parallelWaterfall';
import { repeatFunction, wait, splitInBatches } from './utils';

let startT = null;

const genTask = (id, ms = 1000) => async (data: any) => {
  if (!startT) startT = Date.now();
  const delta = Math.round((Date.now() - startT) / 1000);
  const name = 'task' + id;
  console.log(delta + 's: starting', name, data);
  await wait(ms);
  return data.map((s) => s + '-' + name);
};

const N = 5;
const T = 4;
const K = 1;

const data = [];
repeatFunction(N, (i) => data.push('data' + i));
const tasks = [];
repeatFunction(T, (i) => tasks.push(genTask(i, 1000 * (i + 1))));

export const example = async () => {
  const batchedInput = splitInBatches(data, K);
  try {
    const res = await parallelWaterfall(batchedInput, tasks);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
};
