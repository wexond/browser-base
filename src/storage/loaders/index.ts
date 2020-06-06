import db from './db';
import communication from './communication';

export default async () => {
  await db();
  communication();
};
