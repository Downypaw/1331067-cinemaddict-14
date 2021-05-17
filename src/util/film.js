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
  if (watchedFilms < 0) {
    return 'No rank';
  } else if (watchedFilms > 0 && watchedFilms <= 10) {
    return 'Novice';
  } else if (watchedFilms > 10 && watchedFilms <= 20){
    return 'Fan';
  } else {
    return 'Movie Buff';
  }
};
