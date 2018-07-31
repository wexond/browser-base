/* eslint-disable global-require */
export default {
  /** Day */

  // clear sky
  '01d': require('../../shared/icons/weather/day/weather-clear.png'),
  // few clouds
  '02d': require('../../shared/icons/weather/day/weather-few-clouds.png'),
  // scattered clouds
  '03d': require('../../shared/icons/weather/day/weather-few-clouds.png'),
  // broken clouds
  '04d': require('../../shared/icons/weather/day/weather-few-clouds.png'),
  // shower rain
  '09d': require('../../shared/icons/weather/day/weather-showers.png'),
  // rain
  '10d': require('../../shared/icons/weather/day/weather-rain.png'),
  // thunderstorm
  '11d': require('../../shared/icons/weather/day/weather-storm.png'),
  // snow
  '13d': require('../../shared/icons/weather/day/weather-snow.png'),
  // mist
  '50d': require('../../shared/icons/weather/weather-mist.png'),

  /** Night */

  // clear sky
  '01n': require('../../shared/icons/weather/night/weather-clear.png'),
  // few clouds
  '02n': require('../../shared/icons/weather/night/weather-few-clouds.png'),
  // scattered clouds
  '03n': require('../../shared/icons/weather/night/weather-few-clouds.png'),
  // broken clouds
  '04n': require('../../shared/icons/weather/night/weather-few-clouds.png'),
  // shower rain
  '09n': require('../../shared/icons/weather/night/weather-showers.png'),
  // rain
  '10n': require('../../shared/icons/weather/night/weather-rain.png'),
  // thunderstorm
  '11n': require('../../shared/icons/weather/night/weather-storm.png'),
  // snow
  '13n': require('../../shared/icons/weather/night/weather-snow.png'),
  // mist
  '50n': require('../../shared/icons/weather/weather-mist.png'),
};
/* eslint-enable global-require */

export type WeatherCodes = | '01d'
  | '02d'
  | '03d'
  | '04d'
  | '09d'
  | '11d'
  | '13d'
  | '50d'
  | '01n'
  | '02n'
  | '03n'
  | '04n'
  | '09n'
  | '10n'
  | '11n'
  | '13n'
  | '50n';
