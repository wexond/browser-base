import { requestURL } from './network';

import { Languages } from '../enums';

const apiKeys = [
  '979e1265d1057789445790a1cda05186',
  '1f4bfabb2ae341aac48f57bf99d8d8ab',
  '0e4f6b2d453b75f528588f961958577d',
  'b45df1024d543e944501eae3d2b96f3f',
  '0b4b2ae889e01885c63758a9cdc96e81',
];

export const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const requestWeatherUnsafe = async (
  city: string,
  lang: Languages,
  apiKeyIndex: number = 0,
) => {
  try {
    const langCode = Languages[lang];
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${langCode}&appid=${
      apiKeys[apiKeyIndex]
    }&lang=${langCode}`;

    const data = await requestURL(url);
    const json = JSON.parse(data);

    return {
      city: capitalizeFirst(city),
      coord: json.coord,
      temp: json.main.temp,
      humidity: json.main.humidity,
      pressure: json.main.pressure,
      icon: json.weather[0].icon,
      description: capitalizeFirst(json.weather[0].description),
    };
  } catch (e) {
    return null;
  }
};

export const requestWeather = async (city: string, lang: Languages) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const data = await requestWeatherUnsafe(city, lang, i);

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
