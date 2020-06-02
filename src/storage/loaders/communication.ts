import { parentPort } from 'worker_threads';

export default () => {
  parentPort.on('message', (message: string) => {
    console.log(message);
  });
};
