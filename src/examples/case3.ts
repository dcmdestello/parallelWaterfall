import { parallelWaterfall } from '../parallelWaterfall';
import { repeatFunction, wait, splitInBatches } from './utils';

let startT = null;

const genTask = (id: string | number, ms = 1000, throws = false) => async (
  data: any
) => {
  if (!startT) startT = Date.now();
  const delta = Math.round((Date.now() - startT) / 1000);
  const name = 'task' + id;
  console.log(delta + 's: starting', name, data);
  await wait(ms);
  if (throws) throw new Error(name + ' error with ' + data);
  return data.map((s) => s + '-' + name);
};

const N = 4;
const T = 4;
const K = 1;

const data = [];
repeatFunction(N, (i) => data.push('data' + i));
const tasks = [];
repeatFunction(T - 2, (i) => tasks.push(genTask(i, 1000 * (i + 1))));
tasks.push({ task: genTask(T - 2), options: { cancellable: false } });
tasks.push({ task: genTask(T - 1, 1000, true) });

export const example = async () => {
  const batchedInput = splitInBatches(data, K);
  try {
    const res = await parallelWaterfall(batchedInput, tasks);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
};
