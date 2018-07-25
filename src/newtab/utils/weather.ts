import { requestURL } from '../../shared/utils/network';
import { WEATHER_API_KEY } from '../../shared/constants';
import weatherIcons, { WeatherCodes } from '../defaults/weather-icons';
import { TimeUnit, TemperatureUnit, WeatherLanguages } from '../../shared/enums';
import { getTimeZoneOffset, getTimeInZone } from './time-zone';
import WeatherDailyItem from '../models/weather-daily-item';
import WeatherWeeklyItem from '../models/weather-weekly-item';
import WeatherForecast from '../models/weather-forecast';

const createDailyItem = (data: any, timeZoneOffset: number) => {
  const item: WeatherDailyItem = {
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    precipitation: data.main.humidity,
    winds: data.wind.speed,
    icon: weatherIcons[data.weather[0].icon as WeatherCodes],
    date: getTimeInZone(new Date(data.dt * 1000), timeZoneOffset),
  };

  return item;
};

const getDaily = (current: any, weekly: any, timeZoneOffset: number) => {
  const list: WeatherDailyItem[] = [createDailyItem(current, timeZoneOffset)];
  const currentDate = new Date();

  for (let i = 0; i < weekly.list.length; i++) {
    const item = weekly.list[i];
    const date = new Date(item.dt * 1000);

    if (date.getDate() === currentDate.getDate()) {
      list.push(createDailyItem(item, timeZoneOffset));
    } else {
      break;
    }
  }

  return list;
};

const getWeekly = (weekly: any, timeZoneOffset: number) => {
  const list: WeatherWeeklyItem[] = [];
  const currentDate = new Date();

  for (let i = 0; i < weekly.list.length; i++) {
    const item = weekly.list[i];
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
        (lastItem == null || lastItemDay !== time.getDate())
        && isDay
        && hoursInZone >= 11
        && hoursInZone <= 15
      ) {
        const newItem: WeatherWeeklyItem = {
          dayTemp: temp,
          date: time,
          dayIcon: weatherIcons[icon as WeatherCodes],
        };

        list.push(newItem);
      } else if (
        lastItem
        && lastItem.nightTemp == null
        && !isDay
        && (hoursInZone >= 23 || hoursInZone < 6)
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
  lang: WeatherLanguages,
  tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  timeUnit: TimeUnit = TimeUnit.TwentyFourHours,
  apiKey: string = WEATHER_API_KEY,
) => {
  try {
    const celcius = tempUnit === TemperatureUnit.Celsius;
    const units = celcius ? 'metric' : 'imperial';
    const windsUnit = celcius ? 'km/h' : 'mph';

    const countryCode = WeatherLanguages[lang];

    const currentWeatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${countryCode}&units=${units}`;
    const weekWeatherURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${countryCode}&units=${units}`;

    const currentWeather = JSON.parse(await requestURL(currentWeatherURL));
    const weekWeather = JSON.parse(await requestURL(weekWeatherURL));

    const coord = currentWeather.coord;
    const timeZoneOffset = await getTimeZoneOffset(coord.lat, coord.lon);

    const dailyForecast = getDaily(currentWeather, weekWeather, timeZoneOffset);
    const weeklyForecast = getWeekly(weekWeather, timeZoneOffset);

    const forecast: WeatherForecast = {
      daily: dailyForecast,
      weekly: weeklyForecast,
      windsUnit,
      timeUnit,
      tempUnit,
      lang,
      city,
    };

    return forecast;
  } catch (e) {
    console.warn(e); // eslint-disable-line
    return null;
  }
};

/**
 * Powered by openweathermap.org
 */
