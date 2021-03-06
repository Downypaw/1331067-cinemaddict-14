import FilmListView from '../view/film-list.js';
import FilmListEmptyView from '../view/film-list-empty.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraListView from '../view/extra-list.js';
import SortView from '../view/sort.js';
import LoadingView from '../view/loading.js';
import {render, remove} from '../util/dom-util.js';
import {sortFilmsDate} from '../util/date-time-util.js';
import {sortFilmsRank, sortFilmsCommentsAmount} from '../util/film.js';
import {generateId} from '../util/common.js';
import {filter} from '../util/filter.js';
import {toast} from '../util/toast.js';
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
  constructor(bodyElement, filmListContainer, filmsModel, commentsModel, filterModel, api) {
    this._bodyElement = bodyElement;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._filmListContainer = filmListContainer;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._topFilmsCount = EXTRA_FILM_COUNT;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;


    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._filmListComponent = new FilmListView();
    this._allFilmsContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    this._allFilmsList = this._filmListComponent.getElement().querySelector('.films-list');
    this._topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
    this._filmListEmptyComponent = new FilmListEmptyView();
    this._loadingComponent = new LoadingView();

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

  _updateBoard(data) {
    const updatedCards = Object.keys(this._filmPresenter).filter((key) => this._filmPresenter[key].getFilmId() === data.id);
    updatedCards.forEach((card) => this._filmPresenter[card].init(data));
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._filmListContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmListEmpty() {
    render(this._filmListContainer, this._filmListEmptyComponent);
  }

  _renderFilm(filmList, film) {
    const filmPresenter = new FilmPresenter(filmList, this._bodyElement, this._commentsModel, this._handleViewAction, this._handleModeChange, this._api, this._filmsModel);
    filmPresenter.init(film);
    this._filmPresenter[filmCardId()] = filmPresenter;
  }

  _renderFilms(films, list) {
    films.forEach((film) => this._renderFilm(list, film));
  }

  _renderLoading() {
    render(this._filmListContainer, this._loadingComponent);
  }

  _renderShowMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._allFilmsList, this._showMoreButtonComponent);
  }

  _clearBoard(resetSortType = false) {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
    remove(this._filmListEmptyComponent);

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderSort();
    render(this._filmListContainer, this._filmListComponent);

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }

    render(this._filmListComponent, this._topRatedListComponent);
    render(this._filmListComponent, this._mostCommentedListComponent);
    const allFilms = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    const topRatedFilms = this._getFilms().filter((film) => film.rank !== 0).slice().sort(sortFilmsRank).slice(0, this._topFilmsCount);
    const mostCommentedFilms = this._getFilms().filter((film) => film.comments.length !== 0).slice().sort(sortFilmsCommentsAmount).slice(0, this._topFilmsCount);
    if (filmCount > 0) {
      this._renderFilms(allFilms.slice(0, Math.min(filmCount, this._renderedFilmsCount)), this._allFilmsContainer);

      if (this._getFilms().some((film) => film.rank !== 0)) {
        this._renderFilms(topRatedFilms, this._topRatedContainer);
      }

      if (this._getFilms().some((film) => film.comments.length !== 0)) {
        this._renderFilms(mostCommentedFilms, this._mostCommentedContainer);
      }
    }
  }

  show() {
    this._sortComponent.show();
    this._filmListComponent.show();
  }

  hide() {
    this._sortComponent.hide();
    this._filmListComponent.hide();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, filmUpdate) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(filmUpdate)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .catch(() => {
            toast('This is an error in updating data!');
          });
        break;
      case UserAction.ADD_COMMENT:
        this._api.updateFilm(filmUpdate)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .catch(() => {
            this._filmPresenter[filmUpdate.id].setAborting();
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateBoard(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard(true);
        this._renderFilmBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderFilmBoard();
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films, this._allFilmsContainer);
    this._renderedFilmsCount = newRenderedFilmCount;
    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }
}
