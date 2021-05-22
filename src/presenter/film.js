import FilmCardView from '../view/film-card.js';
import FilmInformationView from '../view/film-information.js';
import {render, onEscKeyDown, remove, replace} from '../util/dom-util.js';
import {UserAction, UpdateType, State} from '../const.js';

const Mode = {
  CARD: 'CARD',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmListContainer, popupContainer, commentsModel, changeData, changeMode, api, filmsModel) {
    this._filmListContainer = filmListContainer;
    this._popupContainer = popupContainer;
    this._commentsModel = commentsModel;
    this._filmsModel = filmsModel;
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
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);

    document.addEventListener('keydown', this._handleEscKeydown);
    document.querySelector('body').classList.add('hide-overflow');

    if (prevFilmPopup === null) {
      render(this._popupContainer, this._filmInformationPopup);
      return;
    }

    if ( prevFilmPopup !== null) {
      const currentScroll = prevFilmPopup.getElement().scrollTop;
      // console.log(currentScroll);
      replace(this._filmInformationPopup, prevFilmPopup);
      this._filmInformationPopup.getElement().scrollTo(0, currentScroll);
    }
    remove(prevFilmPopup);
  }

  _handleModelEvent() {
    if (this._mode === Mode.POPUP) {
      this._api.getComments(this._film.id)
        .then((comments) => {
          this._updateFilm();
          this._commentsModel.setComments(comments);
          this._renderFilmInformationPopup(comments);
        });
    }
  }

  _updateFilm() {
    this._film = this._filmsModel.getFilms().find((film) => film.id === this._film.id);
  }

  _setViewState(state, id) {
    const resetFormState = () => {
      this._filmInformationPopup.updateData({
        isDisabled: false,
        deletingCommentId: '',
      });
    };

    switch (state) {
      case State.SAVING:
        if (this._mode === Mode.POPUP) {
          this._filmInformationPopup.updateData({
            isDisabled: true,
          });
        }
        break;
      case State.DELETING:
        this._filmInformationPopup.updateData({
          isDisabled: true,
          deletingCommentId: id,
        });
        break;
      case State.ABORTING:
        this._filmInformationPopup.shake(resetFormState);
        break;
    }
  }

  setAborting() {
    if (this._filmInformationPopup) {
      this._filmInformationPopup.shake(() => {
        this._filmInformationPopup.updateData({
          isDisabled: false,
          deletingCommentId: null,
        });
      });

      return;
    }
    if (this._filmCardComponent) {
      this._filmCardComponent.shake();
    }
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.POPUP;

    return this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderFilmInformationPopup(comments);
      })
      .catch(() => {
        this.setAborting();
      });
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
    this._setViewState(State.SAVING);
    const newFilmData = Object.assign(
      {},
      this._film,
      {
        isWatchList: !this._film.isWatchList,
      },
    );

    if (this._mode === Mode.POPUP) {
      this._filmInformationPopup.updateData({film: newFilmData});
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newFilmData,
      this._comments,
    );

    this._film = newFilmData;
  }

  _handleWatchedClick() {
    this._setViewState(State.SAVING);
    const newFilmData = Object.assign(
      {},
      this._film,
      {
        isWatched: !this._film.isWatched,
      },
    );

    if (this._mode === Mode.POPUP) {
      this._filmInformationPopup.updateData({film: newFilmData});
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newFilmData,
      this._comments,
    );

    this._film = newFilmData;
  }

  _handleFavoriteClick() {
    this._setViewState(State.SAVING);
    const newFilmData = Object.assign(
      {},
      this._film,
      {
        isFavorite: !this._film.isFavorite,
      },
    );

    if (this._mode === Mode.POPUP) {
      this._filmInformationPopup.updateData({film: newFilmData});
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newFilmData,
      this._comments,
    );

    this._film = newFilmData;
  }

  _handleCommentSend(data) {
    this._setViewState(State.SAVING);

    this._api.addComment(data.filmComments[data.filmComments.length - 1])
      .then((response) => {
        const newData = Object.assign(
          {},
          this._film,
          {
            comments: response.comments,
          },
        );

        this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, newData);
      })
      .catch(() => {
        this._setViewState(State.ABORTING);
      });
  }

  _handleDeleteClick(commentId) {
    this._setViewState(State.DELETING, commentId);

    this._api.deleteComment(commentId)
      .then(() => {

        const newData = Object.assign(
          {},
          this._film,
          {
            comments: this._commentsModel.getComments()
              .filter((comment) => comment.id !== commentId).map((comment) => comment.id),
          },
        );

        this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, newData);
      })
      .catch(() => {
        this._setViewState(State.ABORTING);
      });
  }
}
