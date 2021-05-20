import FilmCardView from '../view/film-card.js';
import FilmInformationView from '../view/film-information.js';
import {render, onEscKeyDown, remove, replace} from '../util/dom-util.js';
import {getCommentLoadError} from '../util/error.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  CARD: 'CARD',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmListContainer, popupContainer, commentsModel, changeData, changeMode, api) {
    this._filmListContainer = filmListContainer;
    this._popupContainer = popupContainer;
    this._commentsModel = commentsModel;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._api = api;

    this._filmComponent = null;
    this._filmInformationPopup = null;
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

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(this._film);
    this._filmComponent.setOpenPopupClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this._filmListContainer, this._filmComponent);
      return;
    }

    if (this._filmListContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  getFilmId() {
    return this._film.id;
  }

  _getComments() {

  }

  destroy() {
    remove(this._filmComponent);
  }

  resetView() {
    if (this._mode !== Mode.CARD) {
      this._handleClosePopupClick();
    }
  }

  _renderFilmInformationPopup(response) {
    this._mode = Mode.POPUP;
    const prevFilmPopup = this._filmInformationPopup;

    this._filmInformationPopup = new FilmInformationView(this._film, response);

    this._filmInformationPopup.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmInformationPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmInformationPopup.setWatchedClickHandler(this._handleWatchedClick);
    this._filmInformationPopup.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmInformationPopup.setDeleteClickHandler(this._handleDeleteClick);
    this._filmInformationPopup.setSendCommentHandler(this._handleCommentSend);

    document.addEventListener('keydown', this._handleEscKeydown);
    document.querySelector('body').classList.add('hide-overflow');

    if (prevFilmPopup === null) {
      render(this._popupContainer, this._filmInformationPopup);
      return;
    }

    if ( prevFilmPopup !== null) {
      replace(this._filmInformationPopup, prevFilmPopup);
    }
    remove(prevFilmPopup);
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.POPUP;

    return this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderFilmInformationPopup(comments);
      })
      .catch(getCommentLoadError());
  }

  _handleClosePopupClick() {
    if (this._filmInformationPopup.getElement().parentNode) {
      this._mode = Mode.CARD;
      this._popupContainer.removeChild(this._filmInformationPopup.getElement());
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._handleEscKeydown);
      this._filmInformationPopup.removeSendCommentHandler();
      this._filmInformationPopup = null;
    }
  }

  _handleWatchlistClick() {
    const newFilmData = Object.assign(
      {},
      this._film,
      {
        isWatchList: !this._film.isWatchList,
      },
    );

    this._filmInformationPopup.updateData({film: newFilmData});

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newFilmData,
      this._comments,
    );

    this._film = newFilmData;
  }

  _handleWatchedClick() {
    const newFilmData = Object.assign(
      {},
      this._film,
      {
        isWatched: !this._film.isWatched,
      },
    );

    this._filmInformationPopup.updateData({film: newFilmData});

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newFilmData,
      this._comments,
    );

    this._film = newFilmData;
  }

  _handleFavoriteClick() {
    const newFilmData = Object.assign(
      {},
      this._film,
      {
        isFavorite: !this._film.isFavorite,
      },
    );

    this._filmInformationPopup.updateData({film: newFilmData});

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newFilmData,
      this._comments,
    );

    this._film = newFilmData;
  }

  _handleCommentSend(evt, data) {
    evt.preventDefault();
    this._filmInformationPopup.constructor.parseStateToData(data, UserAction.ADD_COMMENT);
    data.film.comments.push(data.filmComments[data.filmComments.length - 1].id);

    this._filmInformationPopup.reset(data.film, data.filmComments);
    this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, data.film, data.filmComments[data.filmComments.length - 1]);
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
