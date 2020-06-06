const EPOCH = 11644473600000;

export const chromeTimeValueToDate = (time: number) => {
  return new Date(time / 1000 - EPOCH);
};

export const dateToChromeTime = (date: Date) => {
  return (date.getTime() + EPOCH) * 1000;
};
