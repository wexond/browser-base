import { writeFileSync, ensureFileSync, readFileSync } from 'fs-extra'
const path = require('path');

export class Store {
  path: string
  data: {[key: string]: any}

  constructor(storeDir: string, public opts: any) {
    this.path = path.join(storeDir, `${this.opts.configName}.json`);
    this.data = parseDataFile(this.path, opts.defaults);
    ensureFileSync(this.path)
  }

  // This will just return the property on the `data` object
  get(key: string) {
    return this.data[key] || this.opts.defaults[key];
  }

  // ...and this will set it
  set(key: string, val: any) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: string, defaults: any) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(readFileSync(filePath) as any);
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}
