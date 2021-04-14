import {createElement} from '../util.js';

const getRank = (watchedFilms) => {
  if (watchedFilms > 0 && watchedFilms <= 10) {
    return 'Novice';
  } else if (watchedFilms > 10 && watchedFilms <= 20){
    return 'Fan';
  } else {
    return 'Movie Buff';
  }
};

export const createUserRankTemplate = (watchedFilms) => {
  const rank = getRank(watchedFilms);
  const rankContainer = watchedFilms > 0 ? `<p class="profile__rating">${rank}</p>` : '';

  return `<section class="header__profile profile">
    ${rankContainer}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank {
  constructor(watchedFilms) {
    this._watchedFilms = watchedFilms;
    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate(this._watchedFilms);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
