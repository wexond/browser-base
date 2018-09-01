export const isURL = (input: string): boolean => {
  const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  if (pattern.test(input)) {
    return true;
  }
  return pattern.test(`http://${input}`);
};

export const getDomain = (url: string): string => {
  let hostname = url;

  if (hostname.includes('http://') || hostname.includes('https://')) {
    hostname = hostname.split('://')[1];
  }

  if (hostname.includes('?')) {
    hostname = hostname.split('?')[0];
  }

  if (hostname.includes('://')) {
    hostname = `${hostname.split('://')[0]}://${hostname.split('/')[2]}`;
  } else {
    hostname = hostname.split('/')[0];
  }

  return hostname;
};

export const matchesPattern = (pattern: string, url: string) => {
  if (pattern === '<all_urls>') {
    return true;
  }

  const regexp = new RegExp(
    `^${pattern.replace(/\*/g, '.*').replace('/', '\\/')}$`,
  );
  return url.match(regexp) != null;
};

export const isWexondURL = (url: string) => {
  const pages: any = {
    newtab: 'newtab',
    history: 'history',
  };

  for (const page in pages) {
    if (
      url.startsWith(`wexond://${pages[page]}`) ||
      url.startsWith(`http://localhost:8080/${pages[page]}.html`)
    ) {
      return page;
    }
  }
  return null;
};
