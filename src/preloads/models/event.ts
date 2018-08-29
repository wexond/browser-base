export class Event {
  private callbacks: Function[] = [];

  public emit(...args: any[]) {
    this.callbacks.forEach(callback => {
      callback(...args);
    });
  }

  public addListener(callback: Function) {
    this.callbacks.push(callback);
  }

  public removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter(x => x !== callback);
  }
}
