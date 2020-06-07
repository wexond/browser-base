export class Queue {
  private queue: {
    promise: () => Promise<any>;
    reject: any;
    resolve: any;
  }[] = [];

  private skipMiddle = false;

  private _running = false;

  public get running() {
    return this._running;
  }

  constructor(skipMiddle?: boolean) {
    this.skipMiddle = skipMiddle;
  }

  public enqueue<T>(promise: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.skipMiddle && this.queue.length === 1) this.queue.shift();

      this.queue.push({
        promise,
        resolve,
        reject,
      });

      this.dequeue();
    });
  }

  public async dequeue() {
    if (this.running) return;

    const item = this.queue.shift();

    if (!item) return;

    this._running = true;

    try {
      const value = await item.promise();
      item.resolve(value);
    } catch (err) {
      item.reject(err);
    }

    this._running = false;

    this.dequeue();
  }
}
