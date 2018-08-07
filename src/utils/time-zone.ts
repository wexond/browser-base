import { TIME_ZONE_API_KEY } from '../constants';
import { requestURL } from '.';

export const getTimeZoneOffset = async (
  lat: number,
  lon: number,
  apiKey: string = TIME_ZONE_API_KEY,
) => {
  const loc = `${lat}, ${lon}`;
  const currentDate = new Date();
  const timestamp = currentDate.getTime() / 1000 + currentDate.getTimezoneOffset() * 60;

  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${timestamp}&key=${apiKey}`;
  const data = await requestURL(url);
  const json = JSON.parse(data);

  console.log(json);

  if (json.status === 'OVER_QUERY_LIMIT') {
    return null;
  }

  const offsets = json.dstOffset * 1000 + json.rawOffset * 1000;
  const local = new Date(timestamp * 1000 + offsets);

  return local.getHours() - currentDate.getUTCHours();
};

export const getTimeInZone = (date: Date, timeZoneOffset: number) => {
  date = new Date(date.toUTCString());

  const offset = timeZoneOffset * 60 * 60000;
  const userOffset = date.getTimezoneOffset() * 60000;
  const timeInZone = new Date(date.getTime() + offset + userOffset);

  return timeInZone;
};
