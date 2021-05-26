import {HOUR} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const sortFilmsDate = (filmA, filmB) => {
  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};

export const formatDuration = (min) => {
  if (min < HOUR) {
    return min + 'm';
  } else {
    const hours = Math.floor(min / HOUR);
    const minutes = min % HOUR;
    return hours + 'h ' + minutes + 'm';
  }
};

export const formatReleaseDate = (releaseDate) => {
  return dayjs(releaseDate).format('DD MMMM YYYY');
};

export const humanize = (date) => {
  return dayjs(date).fromNow();
};
