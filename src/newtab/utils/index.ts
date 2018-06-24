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

export const requestWeather = async (
  city: string,
  lang: Languages,
  tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  timeUnit: TimeUnit = TimeUnit.am,
  apiKeyIndex: number = 0,
) => {
  try {
    const langCode = Languages[lang];

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
      WEATHER_API_KEYS[apiKeyIndex]
    }&lang=${langCode}&units=metric`;

    const data = await requestURL(url);
    const json = JSON.parse(data);
    const icon = weatherIcons[json.weather[0].icon as WeatherCodes];

    return {
      city: capitalizeFirstLetter(city.indexOf(',') === -1 ? city : json.name),
      description: capitalizeFirstLetterInEachWord(json.weather[0].description),
      temp: convertTemperature(json.main.temp, tempUnit),
      windSpeed: convertWindSpeed(json.wind.speed, tempUnit),
      precipitation: json.main.humidity,
      pressure: json.main.pressure,
      tempUnit,
      timeUnit,
      icon,
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console

    return null;
  }
};

export const getWeather = async (
  city: string,
  lang: Languages,
  tempUnit?: TemperatureUnit,
  timeUnit?: TimeUnit,
) => {
  for (let i = 0; i < WEATHER_API_KEYS.length; i++) {
    const data = await requestWeather(city, lang, tempUnit, timeUnit, i);

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
