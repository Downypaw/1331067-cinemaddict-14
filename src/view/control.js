// import AbstractView from './abstract.js';
//
// // const getControls = () => {
// //   if ()
// // }
//
// const createControls = (parentClass) => {
//
//   const makeChecked = (key) => {
//     return key === true ? 'checked' : '';
//   };
//
//   const makeActive = (key) => {
//     return key === true ? 'film-card__controls-item--active' : '';
//   };
//
//   if (parentClass === 'film-card') {
//     return `<div class="film-card__controls">
//       <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${makeActive(isWatchList)}" type="button">Add to watchlist</button>
//       <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${makeActive(isWatched)}" type="button">Mark as watched</button>
//       <button class="film-card__controls-item button film-card__controls-item--favorite ${makeActive(isFavorite)}" type="button">Mark as favorite</button>
//     </div>`
//   } else if (parentClass === 'film-details') {
//     return `<section class="film-details__controls">
//       <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${makeChecked(isWatchList)}>
//       <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
//
//       <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${makeChecked(isWatched)}>
//       <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
//
//       <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${makeChecked(isFavorite)}>
//       <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
//     </section>`
//   }
// }
//
// export default class FilmCard extends AbstractView {
//   constructor(parentClass) {
//     super();
//     this._parentClass = parentClass;
//
//     this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
//     this._watchedClickHandler = this._watchedClickHandler.bind(this);
//     this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
//   }
//
//   getTemplate() {
//     return createTemplate(this._parentClass);
//   }
//
//   _watchlistClickHandler() {
//
//   }
//
//   _watchedClickHandler() {
//
//   }
//
//   _favoriteClickHandler() {
//
//   }
//
//   _openPopupHandler(evt) {
//     evt.preventDefault();
//     this._callback.openPopupClick();
//   }
//
//   setOpenPopupClickHandler(callback) {
//     this._callback.openPopupClick = callback;
//     this.getElement().querySelector('#').addEventListener('click', this._openPopupHandler);
//     this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupHandler);
//     this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupHandler);
//   }
// }
