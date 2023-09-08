// const Semaphore = require('./semaphore');
import { Semaphore } from './semaphore';

const forn = (n: number, cb: (i: number) => void) => {
  for (let i = 0; i < n; ++i) {
    cb(i);
  }
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let startT = null;

const genTask = (id, ms = 1000) => async (data: any) => {
  if (!startT) startT = Date.now();
  const delta = Math.round((Date.now() - startT)/1000);
  const name = 'task' + id;
  console.log(delta + 's: starting', name, data);
  await delay(ms);
  return data.map((s) => s + '-' + name);
};

const N = 5;
const T = 4;
const K = 2;

const data = [];
forn(N, (i) => data.push('data' + i));
const tasks = [];
forn(T, (i) => tasks.push(genTask(i, 1000*(i+1))));

const breakArr = (arr: any[], size: number) => {
  const res = [];
  let i = 0;
  while (i < arr.length) {
    res.push(arr.slice(i, i + size));
    i += size;
  }
  return res;
};

type Task = (x: any) => Promise<any>;

type ConfiguredTask = { task: Task; options: Options };
type ConfigurableTask = Task | ConfiguredTask;

type Options = {
  cancellable: boolean;
  concurrency: number;
};
const defaultTaskOptions: Options = {
  cancellable: true,
  concurrency: 1,
};

const parallelWaterfall = async (
  arrays: any[],
  tasksArg: ConfigurableTask[],
  allOptions: Options = defaultTaskOptions
) => {
  const tasks = tasksArg.map((ct) => (typeof ct === 'object' ? ct.task : ct));
  const tasksOptions = tasksArg.map((ct) =>
    typeof ct === 'object'
      ? { ...defaultTaskOptions, ...ct.options }
      : { ...defaultTaskOptions, ...allOptions }
  );

  const semaphores = tasks.map(
    (t, i) => new Semaphore(tasksOptions[i].concurrency)
  );

  let errored = false;
  const lanes = await Promise.all(
    arrays.map(async (batch) => {
      let res = batch;
      for (let i = 0; i < tasks.length; ++i) {
        const options = tasksOptions[i];
        if (errored && options.cancellable) return null;
        const semaphore = semaphores[i];
        try {
          await semaphore.acquire();
          res = await tasks[i](res);
        } catch (err) {
          errored = true;
          throw err;
        } finally {
          semaphore.release();
        }
      }
      return res;
    })
  );
  return lanes;
};

const main = async () => {
  const batchedInput = breakArr(data, K);
  const res = await parallelWaterfall(batchedInput, tasks);
  console.log(res);
};

main();
