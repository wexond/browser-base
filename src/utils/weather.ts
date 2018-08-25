import {
  WeatherDailyItem,
  WeatherWeeklyItem,
  WeatherForecast,
  Dictionary,
} from '~/interfaces';
import { weatherIcons } from '@newtab/defaults/weather-icons';
import { getTimeInZone, getTimeZoneOffset } from '~/utils/time-zone';
import { WEATHER_API_KEY } from '~/constants';
import {
  requestURL,
  getDayIndex,
  capitalizeEachWord,
  formatTime,
} from '~/utils';

const createDailyItem = (data: any, timeZoneOffset: number) => {
  const item: WeatherDailyItem = {
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    precipitation: data.main.humidity,
    winds: data.wind.speed,
    icon: weatherIcons[data.weather[0].icon],
    date: getTimeInZone(new Date(data.dt * 1000), timeZoneOffset),
  };

  return item;
};

const getDaily = (current: any, weekly: any, timeZoneOffset: number) => {
  const list: WeatherDailyItem[] = [createDailyItem(current, timeZoneOffset)];
  const currentDate = new Date();

  console.log(weekly);

  for (const item of weekly.list) {
    const date = new Date(item.dt * 1000);

    // console.log(date.getDate(), currentDate.getDate(), timeZoneOffset);

    list.push(createDailyItem(item, timeZoneOffset));

    if (list.length >= 6) {
      break;
    }

    /*if (date.getDate() === currentDate.getDate()) {
      list.push(createDailyItem(item, timeZoneOffset));
    } else if () 
    
    else {
      break;
    }*/
  }

  return list;
};

const getWeekly = (weekly: any, timeZoneOffset: number) => {
  const list: WeatherWeeklyItem[] = [];
  const currentDate = new Date();

  for (const item of weekly.list) {
    const date = new Date(item.dt * 1000);

    if (date.getDate() !== currentDate.getDate()) {
      const lastItem = list.length > 0 && list[list.length - 1];
      const lastItemDay = lastItem && lastItem.date.getDate();
      const time = getTimeInZone(date, timeZoneOffset);
      const hoursInZone = time.getHours();
      const isDay = item.sys.pod === 'd';
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;

      if (
        (lastItem == null || lastItemDay !== time.getDate()) &&
        isDay &&
        hoursInZone >= 11 &&
        hoursInZone <= 15
      ) {
        const newItem: WeatherWeeklyItem = {
          dayTemp: temp,
          date: time,
          dayIcon: weatherIcons[icon],
        };

        list.push(newItem);
      } else if (
        lastItem &&
        lastItem.nightTemp == null &&
        !isDay &&
        (hoursInZone >= 23 || hoursInZone < 6)
      ) {
        lastItem.nightTemp = temp;
      }
    }
  }

  if (list.length > 0 && list[list.length - 1].nightTemp == null) {
    list.pop();
  }

  return list;
};

export const getWeather = async (
  city: string,
  lang: string,
  tempUnit: 'C' | 'F' = 'C',
  timeUnit: 24 | 12 = 24,
  apiKey: string = WEATHER_API_KEY,
) => {
  try {
    const celcius = tempUnit === 'C';
    const units = celcius ? 'metric' : 'imperial';
    const windsUnit = celcius ? 'km/h' : 'mph';

    const currentWeatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${lang}&units=${units}`;
    const weekWeatherURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${lang}&units=${units}`;

    const currentWeather = JSON.parse(await requestURL(currentWeatherURL));
    const weekWeather = JSON.parse(await requestURL(weekWeatherURL));

    const coord = currentWeather.coord;
    const timeZoneOffset = getTimeZoneOffset(coord.lat, coord.lon);

    const dailyForecast = getDaily(currentWeather, weekWeather, timeZoneOffset);
    const weeklyForecast = getWeekly(weekWeather, timeZoneOffset);

    const forecast: WeatherForecast = {
      windsUnit,
      timeUnit,
      tempUnit,
      lang,
      city,
      daily: dailyForecast,
      weekly: weeklyForecast,
    };

    return forecast;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const formatDescription = (
  dictionary: Dictionary,
  forecast: WeatherForecast,
  index: number,
) => {
  const { dateAndTime } = dictionary;
  const { timeUnit, daily } = forecast;
  const { description, date } = daily[index];
  const dayName = dateAndTime.daysShort[getDayIndex(date)];

  return `${dayName}, ${formatTime(date, timeUnit)}, ${capitalizeEachWord(
    description,
  )}`;
};

/**
 * Powered by openweathermap.org
 */
