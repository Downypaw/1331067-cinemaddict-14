import AbstractView from './abstract.js';

const createTemplate = (rank) => {
  const rankContainer = rank === 'No rank' ? '' : `<p class="profile__rating">${rank}</p>`;

  return `<section class="header__profile profile">
    ${rankContainer}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank extends AbstractView {
  constructor(userRank) {
    super();
    this._userRank = userRank;
  }

  getTemplate() {
    return createTemplate(this._userRank);
  }
}
