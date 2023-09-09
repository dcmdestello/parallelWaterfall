# Parallel Waterfall

Given N inputs, and M tasks, we want each input to be processed sequentially through all tasks, however we don't want to send all inputs at the same time (like with a regular `Promise.all`), we want to limit the amount of data that is being processed by a single task, however we don't want to wait until the first input has finished the whole process before starting the next batch.

`parallelWaterfall` sends each input through the chain of tasks but as soon as tasks are free they start processing the next batch of data.

~~~~
const results = await parallelWaterfall(inputs, tasks);
~~~~

## Example



## Getting Started
Install node modules: `npm install`

Run the code with auto restart: `npm run dev`
