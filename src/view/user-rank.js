import AbstractView from './abstract.js';

const getRank = (watchedFilms) => {
  if (watchedFilms > 0 && watchedFilms <= 10) {
    return 'Novice';
  } else if (watchedFilms > 10 && watchedFilms <= 20){
    return 'Fan';
  } else {
    return 'Movie Buff';
  }
};

export const createTemplate = (watchedFilms) => {
  const rank = getRank(watchedFilms);
  const rankContainer = watchedFilms > 0 ? `<p class="profile__rating">${rank}</p>` : '';

  return `<section class="header__profile profile">
    ${rankContainer}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank extends AbstractView {
  constructor(watchedFilms) {
    super();
    this._watchedFilms = watchedFilms;
  }

  getTemplate() {
    return createTemplate(this._watchedFilms);
  }
}
