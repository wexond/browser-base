import { databases } from '../defaults/databases';
import { Favicon } from '../interfaces';

export const getFavicons = (query: Favicon = {}) => {
  return new Promise((resolve: (favicons: Favicon[]) => void, reject) => {
    databases.favicons.find(query, (err: any, docs: Favicon[]) => {
      if (err) return reject(err);
      resolve(docs);
    });
  });
};

export const addFavicon = async (url: string) => {
  const favicons = await getFavicons({ url });

  if (favicons.length === 0) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const generatedBuffer: any = reader.result;

          databases.favicons.insert({
            url,
            favicon: Buffer.from(generatedBuffer),
          });
        };
        reader.readAsArrayBuffer(blob);
      });
  }
};
