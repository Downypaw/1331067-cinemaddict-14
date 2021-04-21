import FilmCardView from '../view/film-card.js';
import FilmInformationView from '../view/film-information.js';
import {render, onEscKeyDown, remove} from '../util/dom-util.js';

export default class Film {
  constructor(filmListContainer, popupContainer) {
    this._filmListContainer = filmListContainer;
    this._popupContainer = popupContainer;

    this._filmComponent = null;
    this._filmInformationPopup = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    this._filmComponent = new FilmCardView(film);
    this._filmInformationPopup = new FilmInformationView(film, this._comments);

    this._filmComponent.setOpenPopupClickHandler(this._handleFilmCardClick);
    this._filmInformationPopup.setClosePopupClickHandler(this._handleClosePopupClick);

    this._filmComponent.setOpenPopupClickHandler(this._handleFilmCardClick);

    render(this._filmListContainer, this._filmComponent);
  }

  _handleFilmCardClick() {
    this._popupContainer.appendChild(this._filmInformationPopup.getElement());
    document.addEventListener('keydown', (evt) => {
      onEscKeyDown(evt, this._handleClosePopupClick);
    });
    document.querySelector('body').classList.add('hide-overflow');

    this._filmInformationPopup.setClosePopupClickHandler(this._handleClosePopupClick);
  }

  _handleClosePopupClick() {
    if (this._filmInformationPopup.getElement().parentNode) {
      this._popupContainer.removeChild(this._filmInformationPopup.getElement());
      document.querySelector('body').classList.remove('hide-overflow');
    }
  }
}
