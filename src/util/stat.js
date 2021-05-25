import dayjs from 'dayjs';
import {Period} from '../const.js';

export const filterWatchedFilms = ({films, period}) => {
  if (period === Period.ALL_TIME) {
    return films;
  }

  return films.filter((film) => {
    const dateNow = dayjs();
    return dayjs(film.watchingDate).isSame(dateNow, period);
  });
};
