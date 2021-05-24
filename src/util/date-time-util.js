import {HOUR} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const getRandomDate = () => {
  return dayjs.between('2020-01-01', '2021-04-07');
};

export const getReleaseDate = (year) => {
  return dayjs.between('' + year + '-01-01', '' + year + '-12-31');
};

export const getCurrentDate = () => {
  return dayjs().format('YYYY/MM/DD HH:mm');
};

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

export const formatCommentDate = (commentDate) => {
  return dayjs(commentDate).format('YYYY/MM/DD HH:mm');
};

export const humanize = (date) => {
  return dayjs(date).fromNow();
};
