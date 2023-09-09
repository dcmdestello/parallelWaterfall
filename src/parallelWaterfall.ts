import { Semaphore } from './semaphore';

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

export const parallelWaterfall = async (
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
    (_, i) => new Semaphore(tasksOptions[i].concurrency)
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
