import { Queue } from '~/utils/queue';
import { promises } from 'fs';

const queues = new Map<string, Queue>();

export const queueWriteFile = async (path: string, contents: string) => {
  if (!queues.has(path)) queues.set(path, new Queue(true));
  const queue = queues.get(path);

  await queue.enqueue(async () => {
    await promises.writeFile(path, contents);
  });

  if (!queue.running) queues.delete(path);
};
