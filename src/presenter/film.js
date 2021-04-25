import FilmCardView from '../view/film-card.js';
import FilmInformationView from '../view/film-information.js';
import FilmInformationControl from '../view/film-information-control.js';
import {render, onEscKeyDown, remove, replace} from '../util/dom-util.js';

const Mode = {
  CARD: 'CARD',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmListContainer, popupContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmInformationPopup = null;
    this._filmInformationControl = null;
    this._mode = Mode.CARD;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopup = this._filmInformationPopup;
    const prevFilmControl = this._filmInformationControl;

    this._filmComponent = new FilmCardView(film);
    this._filmInformationPopup = new FilmInformationView(film, this._comments);
    this._filmInformationControl = new FilmInformationControl(film);
    this._filmInformationPopup.getElement().querySelector('.film-details__top-container').appendChild(this._filmInformationControl.getElement());

    this._filmComponent.setOpenPopupClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmInformationPopup.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmInformationControl.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmInformationControl.setWatchedClickHandler(this._handleWatchedClick);
    this._filmInformationControl.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this._filmListContainer, this._filmComponent);
      return;
    }

    if (this._filmListContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (!( prevFilmControl === null)) {
      replace(this._filmInformationControl, prevFilmControl);
    }

    remove(prevFilmComponent);
    remove(prevFilmControl);
    this._filmInformationPopup = prevFilmPopup;
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmInformationPopup);
    remove(this._filmInformationControl);
  }

  resetView() {
    if (this._mode !== Mode.CARD) {
      this._handleClosePopupClick();
    }
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.POPUP;
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

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatchList: !this._film.isWatchList,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }
}
