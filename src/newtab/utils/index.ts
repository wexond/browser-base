import { requestURL } from '../../shared/utils/network';
import { WEATHER_API_KEYS } from '../../shared/constants';
import weatherIcons, { WeatherCodes } from '../defaults/weather-icons';
import { Languages, TimeUnit } from '../../shared/enums';
import { TemperatureUnit } from '../enums';
import { capitalizeFirstLetter, capitalizeFirstLetterInEachWord } from '../../shared/utils/strings';

export const convertTemperature = (celsiusTemp: number, tempUnit: TemperatureUnit) => {
  switch (tempUnit) {
    case TemperatureUnit.Celsius: {
      return Math.round(celsiusTemp);
    }
    case TemperatureUnit.Fahrenheit: {
      return Math.round((celsiusTemp * 9) / 5 + 32);
    }
    case TemperatureUnit.Kelvin: {
      return Math.round(celsiusTemp + 273.15);
    }
    default: {
      return null;
    }
  }
};

export const convertWindSpeed = (windSpeed: number, tempUnit: TemperatureUnit) => {
  if (tempUnit === TemperatureUnit.Fahrenheit) {
    return `${Math.round(windSpeed * 2.23693629)} mph`;
  }

  return `${Math.round(windSpeed * 3.6)} km/h`;
};

export const requestCurrentWeather = async (
  city: string,
  lang: Languages,
  tempUnit: TemperatureUnit,
  timeUnit: TimeUnit,
  apiKey: string,
) => {
  try {
    const langCode = Languages[lang];
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${langCode}&units=metric`;

    const data = await requestURL(url);
    const json = JSON.parse(data);

    return {
      description: capitalizeFirstLetterInEachWord(json.weather[0].description),
      temp: convertTemperature(json.main.temp, tempUnit),
      windSpeed: convertWindSpeed(json.wind.speed, tempUnit),
      icon: weatherIcons[json.weather[0].icon as WeatherCodes],
      precipitation: json.main.humidity,
      pressure: json.main.pressure,
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }

  return null;
};

export const requestWeatherForecast = async (
  city: string,
  lang: Languages,
  tempUnit: TemperatureUnit,
  timeUnit: TimeUnit,
  apiKey: string,
) => {
  try {
    const langCode = Languages[lang];
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${langCode}&units=metric`;

    const data = await requestURL(url);
    const json = JSON.parse(data);

    const daily = [];
    const week = [];

    const currentDate = new Date();
    const timeZoneOffset = currentDate.getTimezoneOffset() / 60;

    let night = null;

    console.log(json);

    for (let i = 0; i < json.list.length; i++) {
      const item = json.list[i];
      const date = new Date(item.dt * 1000);
      const hoursDiff = date.getHours() + timeZoneOffset;

      if (date.getDate() === currentDate.getDate()) {
        daily.push({
          description: capitalizeFirstLetterInEachWord(item.weather[0].description),
          temp: convertTemperature(item.main.temp, tempUnit),
          windSpeed: convertWindSpeed(item.wind.speed, tempUnit),
          icon: weatherIcons[item.weather[0].icon as WeatherCodes],
          precipitation: item.main.humidity,
          pressure: item.main.pressure,
          date,
        });
      } else if (hoursDiff === 0) {
        night = {
          temp: convertTemperature(item.main.temp, tempUnit),
        };
      } else if (hoursDiff === 15) {
        week.push({
          day: {
            temp: convertTemperature(item.main.temp, tempUnit),
            icon: weatherIcons[item.weather[0].icon as WeatherCodes],
          },
          night,
          date,
        });
      }
    }

    return {
      daily,
      week,
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }

  return null;
};

export const getWeather = async (
  city: string,
  lang: Languages,
  tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  timeUnit: TimeUnit = TimeUnit.am,
) => {
  let apiKeyIndex = 0;

  let current;
  let forecast;

  for (apiKeyIndex = 0; apiKeyIndex < WEATHER_API_KEYS.length; apiKeyIndex++) {
    current = await requestCurrentWeather(
      city,
      lang,
      tempUnit,
      timeUnit,
      WEATHER_API_KEYS[apiKeyIndex],
    );

    forecast = await requestWeatherForecast(
      city,
      lang,
      tempUnit,
      timeUnit,
      WEATHER_API_KEYS[apiKeyIndex],
    );

    if (current != null && forecast != null) {
      break;
    }
  }

  if (apiKeyIndex < WEATHER_API_KEYS.length) {
    return {
      city: capitalizeFirstLetter(city),
      tempUnit,
      timeUnit,
      daily: {
        current,
        later: forecast.daily,
      },
      week: forecast.week,
    };
  }

  return null;
};

/**
 * Conditions
 * https://openweathermap.org/weather-conditions
 */
