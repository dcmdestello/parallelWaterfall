# Parallel Waterfall

\- Just a snippet of code I like. -

Given N inputs, and M async tasks, we want each input item to be processed sequentially through all tasks, feeding the input to the first task and then passing that output to the second and so on. The result is an array of N items, containing each of the input values having gone through the chain of tasks. However, it also ensures that:

* It parallelizes as much as possible: As soon as the first task is done processing the first item it immediately begins processing the second item. It does not wait for the first item to go through the whole chain.
* No task is at any point processing two inputs at the same time. (This is useful to prevent overloading that system, or potential racing conditions.)

So, `parallelWaterfall` sends each input through the chain of tasks but as soon as tasks are free they start processing the next batch of data. This achieves performance while preserving a desired split of the input in N batches.

~~~~
const results = await parallelWaterfall(inputs, tasks, globalOptions);
~~~~

## Parameters

**inputs**: Any array of data, `any[]`.

**tasks**:  An array of tasks, `Task[]`. A `Task` being any async function that takes 1 input `async (any) => any`. Alternatively each of the item in `tasks` can also be an object `{ task: Task, options: Options }`, where that task will be configured with the given options, see below.

**globalOptions**: An `Options` object that will be applied to all tasks. Task with defined individual options override this globalOptions.

**Options**:
  * **cancellable**: `boolean`, default `true`. If true the this task will stop forwarding the data to the next step if any of the other data items in any of the other steps errored. 
  * **concurrency**: `number`, default `1`. How many of input items can be processed in a given task at the same time.

## Name explanation

"waterfall" as in a chain of steps where each feeds the next one.

"parallel" in that it runs through the waterfall with several parallel lanes.