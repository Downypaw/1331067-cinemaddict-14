import {MenuItem} from '../const';

export const filter = {
  [MenuItem.ALL]: (films) => films.filter((film) => film),
  [MenuItem.WATCHLIST]: (films) => films.filter((film) => film.isWatchList),
  [MenuItem.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [MenuItem.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [MenuItem.STATISTICS]: (films) => films.filter((film) => film),
};
