import FilmCardView from '../view/film-card.js';
import FilmInformationView from '../view/film-information.js';
import {render, onEscKeyDown, remove, replace} from '../util/dom-util.js';
import {UserAction, UpdateType} from '../const.js';

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

    this._handleEscKeydown = (evt) => {
      onEscKeyDown(evt, this._handleClosePopupClick);
    };

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCommentSend = this._handleCommentSend.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopup = this._filmInformationPopup;
    const prevFilmControl = this._filmInformationControl;

    this._filmComponent = new FilmCardView(film);
    this._filmInformationPopup = new FilmInformationView(film, this._comments);
    this._filmInformationControl = this._filmInformationPopup.getElement().querySelector('.film-details__controls');

    this._filmComponent.setOpenPopupClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmInformationPopup.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmInformationPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmInformationPopup.setWatchedClickHandler(this._handleWatchedClick);
    this._filmInformationPopup.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmInformationPopup.setDeleteClickHandler(this._handleDeleteClick);

    if (prevFilmComponent === null) {
      render(this._filmListContainer, this._filmComponent);
      return;
    }

    if (this._filmListContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if ( prevFilmControl !== null) {
      prevFilmPopup.updateData({
        film: this._filmInformationPopup.getData().film,
      });

    }

    remove(prevFilmComponent);
    prevFilmControl.remove();
    this._filmInformationPopup = prevFilmPopup;
  }

  getFilmId() {
    return this._film.id;
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmInformationPopup);
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
    document.addEventListener('keydown', this._handleEscKeydown);
    document.querySelector('body').classList.add('hide-overflow');

    this._filmInformationPopup.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmInformationPopup.setSendCommentHandler(this._handleCommentSend);
  }

  _handleClosePopupClick() {
    if (this._filmInformationPopup.getElement().parentNode) {
      this._popupContainer.removeChild(this._filmInformationPopup.getElement());
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._handleEscKeydown);
      this._filmInformationPopup.removeSendCommentHandler();
    }
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatchList: !this._film.isWatchList,
        },
      ), this._comments,
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ), this._comments,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ), this._comments,
    );
  }

  _handleCommentSend(evt, data) {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 13) {
      evt.preventDefault();
      data.film.comments.push(data.filmComments[data.filmComments.length - 1].id);

      this._filmInformationPopup.reset(data.film, data.filmComments);
      this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, data.film, data.filmComments[data.filmComments.length - 1]);
    }
  }

  _handleDeleteClick(data, commentId) {
    const commentIndex = data.film.comments.findIndex((comment) => comment === Number(commentId));

    data.film.comments = [
      ...data.film.comments.slice(0, commentIndex),
      ...data.film.comments.slice(commentIndex + 1),
    ];

    this._filmInformationPopup.reset(data.film, data.filmComments);

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      data.film,
      data.filmComments[commentId - 1],
    );
  }
}
