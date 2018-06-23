import { requestURL } from './network';

import { Languages, TemperatureUnit, TimeUnit } from '../enums';
import { weatherApiKeys } from '../defaults/apiKeys';

export const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const convertTemperature = (celsiusTemp: number, tempUnit: TemperatureUnit) => {
  switch (tempUnit) {
    case TemperatureUnit.Celsius: {
      return Math.round(celsiusTemp);
    }
    case TemperatureUnit.Fahrenheit: {
      return Math.round(celsiusTemp * 9 / 5 + 32);
    }
    case TemperatureUnit.Kelvin: {
      return Math.round(celsiusTemp + 273.15);
    }
    default: {
      return null;
    }
  }
};

export const requestWeatherUnsafe = async (
  city: string,
  lang: Languages,
  tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  timeUnit: TimeUnit = TimeUnit.AM,
  apiKeyIndex: number = 0,
) => {
  try {
    const langCode = Languages[lang];
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
      weatherApiKeys[apiKeyIndex]
    }&lang=${langCode}&units=metric`;

    const data = await requestURL(url);
    const json = JSON.parse(data);

    return {
      city: capitalizeFirst(city.indexOf(',') === -1 ? city : json.name),
      description: capitalizeFirst(json.weather[0].description),
      coord: json.coord,
      temp: convertTemperature(json.main.temp, tempUnit),
      humidity: json.main.humidity,
      pressure: json.main.pressure,
      icon: json.weather[0].icon,
      wind: json.wind,
      tempUnit,
      timeUnit,
    };
  } catch (e) {
    return null;
  }
};

export const requestWeather = async (
  city: string,
  lang: Languages,
  tempUnit?: TemperatureUnit,
  timeUnit?: TimeUnit,
) => {
  for (let i = 0; i < weatherApiKeys.length; i++) {
    const data = await requestWeatherUnsafe(city, lang, tempUnit, timeUnit, i);

    if (data != null) {
      return data;
    }
  }

  return null;
};

/**
 * Conditions
 * https://openweathermap.org/weather-conditions
 */
