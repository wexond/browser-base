import { requestURL } from '../../shared/utils/network';
import { TIME_ZONE_API_KEY } from '../../shared/constants';

export const getTimeZone = async (lat: number, lon: number, apiKey: string = TIME_ZONE_API_KEY) => {
  const loc = `${lat}, ${lon}`;
  const currentDate = new Date();
  const timestamp = currentDate.getTime() / 1000 + currentDate.getTimezoneOffset() * 60;

  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${timestamp}&key=${apiKey}`;
  const data = await requestURL(url);
  const json = JSON.parse(data);

  const offsets = json.dstOffset * 1000 + json.rawOffset * 1000;
  const local = new Date(timestamp * 1000 + offsets);

  // console.log(local.getTimezoneOffset() / 60);

  return local;
};
