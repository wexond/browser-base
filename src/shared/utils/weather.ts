import { requestURL } from './network';

import { Languages } from '../enums';

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const requestWeather = async (
  city: string,
  lang: Languages,
  apiKey: string = '979e1265d1057789445790a1cda05186', // 1f4bfabb2ae341aac48f57bf99d8d8ab
) => {
  const langCode = Languages[lang];

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${langCode}&appid=${apiKey}&lang=${langCode}`;

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
};

/**
 * Conditions
 * https://openweathermap.org/weather-conditions
 */
