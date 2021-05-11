import FilmListView from '../view/film-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraListView from '../view/extra-list.js';
import SortView from '../view/sort.js';
import {render, remove} from '../util/dom-util.js';
import {sortFilmsDate} from '../util/date-time-util.js';
import {sortFilmsRank, sortFilmsCommentsAmount} from '../util/film.js';
import {generateId} from '../util/common.js';
import {filter} from '../util/filter.js';
import FilmPresenter from './film.js';
import {SortType, UpdateType, UserAction} from '../const.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;
const filmCardId = generateId();

const ExtraListTitles = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class FilmBoard {
  constructor(filmListContainer, filmsModel, commentsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._filmListContainer = filmListContainer;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._topFilmsCount = EXTRA_FILM_COUNT;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);

    this._filmListComponent = new FilmListView(this._getFilms());
    this._allFilmsContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    this._topRatedContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    this._mostCommentedContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmBoard();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmsRank);
    }

    return filtredFilms;
  }

  _getComments() {
    return this._commentsModel.getComments().slice();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, filmUpdate, commentUpdate) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, filmUpdate);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, filmUpdate, commentUpdate);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.deleteComment(updateType, filmUpdate, commentUpdate);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateBoard(data);
        break;
      case UpdateType.MINOR:
        this._updateBoard(data, {resetFilter: true});
        break;
      case UpdateType.MAJOR:
        this._clearBoard(true);
        this._renderFilmBoard();
        break;
    }
  }

  _updateBoard(data) {
    const updatedCards = Object.keys(this._filmPresenter).filter((key) => this._filmPresenter[key].getFilmId() === data.id);
    updatedCards.forEach((card) => this._filmPresenter[card].init(data, this._getComments()));
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderFilmBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmListContainer, this._sortComponent);
  }

  _renderFilm(filmList, film) {
    const filmPresenter = new FilmPresenter(filmList, this._filmListContainer, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film, this._getComments());
    this._filmPresenter[filmCardId()] = filmPresenter;
  }

  _renderFilms(films, list) {
    films.forEach((film) => this._renderFilm(list, film));
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;
    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._filmListComponent, this._showMoreButtonComponent);
  }

  _clearBoard(resetSortType = false) {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmBoard() {
    const films = this._getFilms();
    const filmCount = films.length;
    this._renderSort();
    render(this._filmListContainer, this._filmListComponent);
    render(this._filmListComponent, this._topRatedListComponent);
    render(this._filmListComponent, this._mostCommentedListComponent);
    const allFilms = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    const topRatedFilms = this._getFilms().slice().sort(sortFilmsRank).slice(0, this._topFilmsCount);
    const mostCommentedFilms = this._getFilms().slice().sort(sortFilmsCommentsAmount).slice(0, this._topFilmsCount);
    if (filmCount > 0) {
      this._renderFilms(allFilms.slice(0, Math.min(filmCount, this._renderedFilmsCount)), this._allFilmsContainer);
      this._renderFilms(topRatedFilms, this._topRatedContainer);
      this._renderFilms(mostCommentedFilms, this._mostCommentedContainer);
    }

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }
}
