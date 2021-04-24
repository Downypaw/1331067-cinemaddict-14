import AbstractView from './abstract.js';

const createTemplate = (film) => {
  const {isWatchList, isWatched, isFavorite} = film;

  const makeChecked = (key) => {
    return key === true ? 'checked' : '';
  };

  return `<section class="film-details__controls">
    <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${makeChecked(isWatchList)}>
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${makeChecked(isWatched)}>
    <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
    <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${makeChecked(isFavorite)}>
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
  </section>`;
};

export default class FilmInformationControl extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTemplate(this._film);
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

  setWatchlistClickHandler (callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler (callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler (callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
