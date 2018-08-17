/* eslint-disable global-require */
export const weatherIcons: { [key: string]: string } = {
  /** Day */

  // clear sky
  '01d': require('../renderer/resources/icons/weather/day/weather-clear.png'),
  // few clouds
  '02d': require('../renderer/resources/icons/weather/day/weather-few-clouds.png'),
  // scattered clouds
  '03d': require('../renderer/resources/icons/weather/day/weather-few-clouds.png'),
  // broken clouds
  '04d': require('../renderer/resources/icons/weather/day/weather-few-clouds.png'),
  // shower rain
  '09d': require('../renderer/resources/icons/weather/day/weather-showers.png'),
  // rain
  '10d': require('../renderer/resources/icons/weather/day/weather-rain.png'),
  // thunderstorm
  '11d': require('../renderer/resources/icons/weather/day/weather-storm.png'),
  // snow
  '13d': require('../renderer/resources/icons/weather/day/weather-snow.png'),
  // mist
  '50d': require('../renderer/resources/icons/weather/weather-mist.png'),

  /** Night */

  // clear sky
  '01n': require('../renderer/resources/icons/weather/night/weather-clear.png'),
  // few clouds
  '02n': require('../renderer/resources/icons/weather/night/weather-few-clouds.png'),
  // scattered clouds
  '03n': require('../renderer/resources/icons/weather/night/weather-few-clouds.png'),
  // broken clouds
  '04n': require('../renderer/resources/icons/weather/night/weather-few-clouds.png'),
  // shower rain
  '09n': require('../renderer/resources/icons/weather/night/weather-showers.png'),
  // rain
  '10n': require('../renderer/resources/icons/weather/night/weather-rain.png'),
  // thunderstorm
  '11n': require('../renderer/resources/icons/weather/night/weather-storm.png'),
  // snow
  '13n': require('../renderer/resources/icons/weather/night/weather-snow.png'),
  // mist
  '50n': require('../renderer/resources/icons/weather/weather-mist.png'),
};
/* eslint-enable global-require */
