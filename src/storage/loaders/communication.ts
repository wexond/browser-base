import { MessageChannel } from 'worker_threads';

export const messageChannel = new MessageChannel();
export const port = messageChannel.port1;

export default () => {
  port.on('message', (message: string) => {
    console.log(message);
  });
};
