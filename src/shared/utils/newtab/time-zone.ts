const tzlookup = require('tz-lookup');

export const getTimeZoneOffset = (lat: number, lon: number) => {
  const timeZone = tzlookup(lat, lon);
  const current = new Date();
  const local = new Date(new Date().toLocaleString('en-US', { timeZone }));

  return local.getHours() - current.getUTCHours();
};

export const getTimeInZone = (date: Date, timeZoneOffset: number) => {
  date = new Date(date.toUTCString());

  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const local = new Date(utc + 3600000 * timeZoneOffset);

  return local;
};
