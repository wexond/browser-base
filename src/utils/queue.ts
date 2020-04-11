export class Queue {
  private queue: {
    promise: () => Promise<any>;
    reject: any;
    resolve: any;
  }[] = [];
  private pendingPromise = false;

  public enqueue<T>(promise: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });

      this.dequeue();
    });
  }

  public dequeue() {
    if (this.pendingPromise) {
      return false;
    }
    const item = this.queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.pendingPromise = true;
      item
        .promise()
        .then((value) => {
          this.pendingPromise = false;
          item.resolve(value);
          this.dequeue();
        })
        .catch((err) => {
          this.pendingPromise = false;
          item.reject(err);
          this.dequeue();
        });
    } catch (err) {
      this.pendingPromise = false;
      item.reject(err);
      this.dequeue();
    }
    return true;
  }
}
