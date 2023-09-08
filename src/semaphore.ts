export class Semaphore {
  private tasks: Array<() => void> = [];

  count: number;
  private max: number;

  constructor(count: number) {
    this.max = count;
    this.count = count;
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.count > 0) {
        this.count -= 1;
        resolve();
      } else {
        this.tasks.push(resolve);
      }
    });
  }

  tryAcquire(): boolean {
    if (this.count > 0) {
      this.count -= 1;
      return true;
    }
    return false;
  }

  release(): void {
    if (this.tasks.length > 0) {
      const next = this.tasks.shift();
      if (next !== undefined) {
        next();
      }
    } else {
      this.count += 1;
      if (this.count > this.max) {
        this.count = this.max;
        throw new Error(
          'Semaphore went over its initial count, we are releasing more than acquiring.'
        );
      }
    }
  }
}
