import {FilmCountForUserRank} from '../const.js';

export const sortFilmsRank = (filmA, filmB) => {
  const valueA = filmA.rank;
  const valueB = filmB.rank;

  return valueB - valueA;
};

export const sortFilmsCommentsAmount = (filmA, filmB) => {
  const valueA = filmA.comments.length;
  const valueB = filmB.comments.length;

  return valueB - valueA;
};

export const defineUserRank = (films) => {
  const watchedFilms = films.filter((film) => film.isWatched === true).length;
  if (watchedFilms < FilmCountForUserRank.MIN_NOVICE) {
    return 'No rank';
  } else if (watchedFilms > FilmCountForUserRank.MIN_NOVICE && watchedFilms <= FilmCountForUserRank.MAX_NOVICE) {
    return 'Novice';
  } else if (watchedFilms > FilmCountForUserRank.MAX_NOVICE && watchedFilms <= FilmCountForUserRank.MAX_FAN) {
    return 'Fan';
  } else {
    return 'Movie Buff';
  }
};
