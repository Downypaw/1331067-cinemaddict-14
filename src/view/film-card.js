import AbstractView from './abstract.js';

const MAX_STRING_LENGTH = 140;
const SUBSTRING_LENGTH = 139;

const getDescription = (text) => {
  return text.length > MAX_STRING_LENGTH ? text.substr(0, SUBSTRING_LENGTH) + '...' : text;
};

const createTemplate = (film) => {
  const {title, rank, year, duration, genre, poster, comments, isWatchList, isWatched, isFavorite} = film;
  let {description} = film;

  description = getDescription(description);

  const makeActive = (value) => {
    return value === true ? 'film-card__controls-item--active' : '';
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rank}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre.join(', ')}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${makeActive(isWatchList)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${makeActive(isWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${makeActive(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTemplate(this._film);
  }

  setOpenPopupClickHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupHandler);
  }

  setWatchlistClickHandler (callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler (callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler (callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.openPopupClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
