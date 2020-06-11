const EPOCH = 11644473600000;

export const convertFromChromeTime = (time: number) => {
  return time / 1000 - EPOCH;
};

export const convertToChromeTime = (time: number) => {
  if (!time) return null;
  return (time + EPOCH) * 1000;
};

export const chromeTimeValueToDate = (time: number) => {
  return new Date(convertFromChromeTime(time));
};

export const dateToChromeTime = (date: Date) => {
  return convertToChromeTime(date.getTime());
};
