import add from '~/shared/resources/icons/add.svg';
import back from '~/shared/resources/icons/back.svg';
import forward from '~/shared/resources/icons/forward.svg';
import refresh from '~/shared/resources/icons/refresh.svg';
import close from '~/shared/resources/icons/close.svg';
import search from '~/shared/resources/icons/search.svg';
import page from '~/shared/resources/icons/page.svg';
import download from '~/shared/resources/icons/download.svg';
import history from '~/shared/resources/icons/history.svg';
import bookmarks from '~/shared/resources/icons/bookmarks.svg';
import settings from '~/shared/resources/icons/settings.svg';
import extensions from '~/shared/resources/icons/extensions.svg';
import window from '~/shared/resources/icons/window.svg';
import more from '~/shared/resources/icons/more.svg';
import find from '~/shared/resources/icons/find.svg';
import edit from '~/shared/resources/icons/edit.svg';
import down from '~/shared/resources/icons/down.svg';
import arrowBack from '~/shared/resources/icons/arrow-back.svg';
import star from '~/shared/resources/icons/star.svg';
import starFilled from '~/shared/resources/icons/star-filled.svg';
import fire from '~/shared/resources/icons/fire.svg';
import trash from '~/shared/resources/icons/delete.svg';
import up from '~/shared/resources/icons/up.svg';
import shield from '~/shared/resources/icons/shield.svg';
import night from '~/shared/resources/icons/night.svg';
import multrin from '~/shared/resources/icons/drop-window.svg';

import weatherDayClear from '~/shared/resources/icons/weather/day/clear.png';
import weatherDayFewClouds from '~/shared/resources/icons/weather/day/few-clouds.png';
import weatherDayRain from '~/shared/resources/icons/weather/day/rain.png';
import weatherDayShowers from '~/shared/resources/icons/weather/day/showers.png';
import weatherDaySnow from '~/shared/resources/icons/weather/day/snow.png';
import weatherDayStorm from '~/shared/resources/icons/weather/day/storm.png';

import weatherNightClear from '~/shared/resources/icons/weather/night/clear.png';
import weatherNightFewClouds from '~/shared/resources/icons/weather/night/few-clouds.png';
import weatherNightRain from '~/shared/resources/icons/weather/night/rain.png';
import weatherNightShowers from '~/shared/resources/icons/weather/night/showers.png';
import weatherNightSnow from '~/shared/resources/icons/weather/night/snow.png';
import weatherNightStorm from '~/shared/resources/icons/weather/night/storm.png';

export const icons = {
  add,
  back,
  forward,
  close,
  refresh,
  search,
  page,
  download,
  history,
  bookmarks,
  settings,
  extensions,
  window,
  more,
  find,
  edit,
  down,
  arrowBack,
  star,
  starFilled,
  fire,
  trash,
  up,
  shield,
  night,
  multrin,
  weather: {
    day: {
      clear: weatherDayClear,
      fewClouds: weatherDayFewClouds,
      rain: weatherDayRain,
      showers: weatherDayShowers,
      snow: weatherDaySnow,
      storm: weatherDayStorm,
    },
    night: {
      clear: weatherNightClear,
      fewClouds: weatherNightFewClouds,
      rain: weatherNightRain,
      showers: weatherNightShowers,
      snow: weatherNightSnow,
      storm: weatherNightStorm,
    },
  },
};
