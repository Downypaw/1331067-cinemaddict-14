import SmartView from './smart.js';
import {NAMES, UserAction} from '../const';
import {getRandomArrayElement, commentId} from '../util/common.js';
import {getCurrentDate} from '../util/date-time-util.js';

const createGenreTemplate = (genre) => {
  return `${genre.map((genreTemplate) => `<span class="film-details__genre">${genreTemplate}</span>`).join('')}`;
};

const createCommentTemplate = (comments, filmComments) => {
  return `${comments.map((commentKey) => filmComments.find((item) => item.id === commentKey))
    .map((comment) =>
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${comment.date}</span>
            <button class="film-details__comment-delete" id="${comment.id}">Delete</button>
          </p>
        </div>
      </li>`,
    ).join('')}`;
};

const createEmojiImage = (emoji) => {
  return emoji !== '' ? `<img src="images/emoji/${emoji}.png" width="55" height='55'>` : '';
};

const createTemplate = (data) => {
  const {film, filmComments, emoji, userComment} = data;
  const {title, originalTitle, rank, director, screenwriters, cast, releaseDate, country, duration, genre, poster, description, comments, ageRating, isWatchList, isWatched, isFavorite} = film;

  const makeChecked = (value) => {
    return value ? 'checked' : '';
  };

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
            <p class="film-details__age">${ageRating}</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${originalTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rank}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${screenwriters.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${cast.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${createGenreTemplate(genre)}
                </td>
              </tr>
            </table>
            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${makeChecked(isWatchList)}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${makeChecked(isWatched)}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${makeChecked(isFavorite)}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${createCommentTemplate(comments, filmComments)}
          </ul>
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${createEmojiImage(emoji)}</div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${userComment}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};


export default class FilmInformation extends SmartView  {
  constructor(film, filmComments) {
    super();
    this._data = FilmInformation.parseDataToState(film, filmComments);
    this._film = this._data.film;
    this._filmComments = this._data.filmComments;

    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._sendCommentHandler = this._sendCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._setInnerHandlers();
  }

  reset(film, comments) {
    this.updateData(
      FilmInformation.parseDataToState(film, comments),
    );
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  getData() {
    return this._data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setClosePopupClickHandler(this._callback.closePopupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((item) => {
        item.addEventListener('click', this._emojiClickHandler);
      });
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  setClosePopupClickHandler(callback) {
    this._callback.closePopupClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setSendCommentHandler(callback) {
    this._callback.sendComment = callback;
    document.addEventListener('keydown', this._sendCommentHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this._deleteCommentHandler));
  }

  removeSendCommentHandler() {
    document.removeEventListener('keydown', this._sendCommentHandler);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    const currentScroll = document.querySelector('.film-details').scrollTop;

    this.updateData({
      emoji: evt.target.value,
    });

    document.querySelector('.film-details').scrollTo(0, currentScroll);
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      userComment: evt.target.value,
    }, true);
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupClick();
  }

  _watchlistClickHandler(evt) {
    const currentScroll = document.querySelector('.film-details').scrollTop;
    evt.preventDefault();
    this._callback.watchlistClick();
    document.querySelector('.film-details').scrollTo(0, currentScroll);
  }

  _watchedClickHandler(evt) {
    const currentScroll = document.querySelector('.film-details').scrollTop;
    evt.preventDefault();
    this._callback.watchedClick();
    document.querySelector('.film-details').scrollTo(0, currentScroll);
  }

  _favoriteClickHandler(evt) {
    const currentScroll = document.querySelector('.film-details').scrollTop;
    evt.preventDefault();
    this._callback.favoriteClick();
    document.querySelector('.film-details').scrollTo(0, currentScroll);
  }

  _sendCommentHandler(evt) {
    const currentScroll = this.getElement().scrollTop;
    this._callback.sendComment(evt, FilmInformation.parseStateToData(this._data, UserAction.ADD_COMMENT));
    this.getElement().scrollTo(0, currentScroll);
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    const currentScroll = this.getElement().scrollTop;
    this._callback.deleteClick(FilmInformation.parseStateToData(this._data, UserAction.DELETE_COMMENT), evt.target.id);
    this.getElement().scrollTo(0, currentScroll);
  }

  static parseDataToState(filmData, filmCommentsData) {
    return {
      film: Object.assign({}, filmData),
      filmComments: filmCommentsData.slice(),
      emoji: '',
      userComment: '',
    };
  }

  static parseStateToData(data, userActionType) {
    data = Object.assign({}, data);

    switch(userActionType) {
      case UserAction.ADD_COMMENT:
        data.filmComments.push({
          id: commentId(),
          text: data.userComment,
          emotion: data.emoji,
          author: getRandomArrayElement(NAMES),
          date: getCurrentDate(),
        });
        delete data.emoji;
        delete data.userComment;
        break;
      case UserAction.DELEATE_COMMENT:
        break;
    }
    return data;
  }
}
