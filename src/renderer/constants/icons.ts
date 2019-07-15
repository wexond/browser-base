import add from '~/renderer/resources/icons/add.svg';
import back from '~/renderer/resources/icons/back.svg';
import forward from '~/renderer/resources/icons/forward.svg';
import refresh from '~/renderer/resources/icons/refresh.svg';
import close from '~/renderer/resources/icons/close.svg';
import search from '~/renderer/resources/icons/search.svg';
import page from '~/renderer/resources/icons/page.svg';
import download from '~/renderer/resources/icons/download.svg';
import history from '~/renderer/resources/icons/history.svg';
import bookmarks from '~/renderer/resources/icons/bookmarks.svg';
import settings from '~/renderer/resources/icons/settings.svg';
import extensions from '~/renderer/resources/icons/extensions.svg';
import window from '~/renderer/resources/icons/window.svg';
import more from '~/renderer/resources/icons/more.svg';
import find from '~/renderer/resources/icons/find.svg';
import edit from '~/renderer/resources/icons/edit.svg';
import down from '~/renderer/resources/icons/down.svg';
import arrowBack from '~/renderer/resources/icons/arrow-back.svg';
import star from '~/renderer/resources/icons/star.svg';
import starFilled from '~/renderer/resources/icons/star-filled.svg';
import fire from '~/renderer/resources/icons/fire.svg';
import trash from '~/renderer/resources/icons/delete.svg';
import up from '~/renderer/resources/icons/up.svg';
import shield from '~/renderer/resources/icons/shield.svg';
import night from '~/renderer/resources/icons/night.svg';
import multrin from '~/renderer/resources/icons/drop-window.svg';
import visible from '~/renderer/resources/icons/visible.svg';
import invisible from '~/renderer/resources/icons/invisible.svg';
import dropDown from '~/renderer/resources/icons/drop-down.svg';
import check from '~/renderer/resources/icons/check.svg';

import weatherDayClear from '~/renderer/resources/icons/weather/day/clear.png';
import weatherDayFewClouds from '~/renderer/resources/icons/weather/day/few-clouds.png';
import weatherDayRain from '~/renderer/resources/icons/weather/day/rain.png';
import weatherDayShowers from '~/renderer/resources/icons/weather/day/showers.png';
import weatherDaySnow from '~/renderer/resources/icons/weather/day/snow.png';
import weatherDayStorm from '~/renderer/resources/icons/weather/day/storm.png';

import weatherNightClear from '~/renderer/resources/icons/weather/night/clear.png';
import weatherNightFewClouds from '~/renderer/resources/icons/weather/night/few-clouds.png';
import weatherNightRain from '~/renderer/resources/icons/weather/night/rain.png';
import weatherNightShowers from '~/renderer/resources/icons/weather/night/showers.png';
import weatherNightSnow from '~/renderer/resources/icons/weather/night/snow.png';
import weatherNightStorm from '~/renderer/resources/icons/weather/night/storm.png';

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
  visible,
  invisible,
  dropDown,
  check,
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
