export const createUserRankTemplate = (watchedFilms) => {
  let rank = 0;
  if (watchedFilms > 0 && watchedFilms <= 10) {
    rank = 'Novice';
  } else if (watchedFilms > 10 && watchedFilms <= 20){
    rank = 'Fan';
  } else {
    rank = 'Movie Buff';
  }
  const rankContainer = watchedFilms > 0 ? `<p class="profile__rating">${rank}</p>` : '';

  return `<section class="header__profile profile">
    ${rankContainer}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
