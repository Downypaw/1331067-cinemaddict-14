import FilmListView from '../view/film-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraListView from '../view/extra-list.js';
import SortView from '../view/sort.js';
import {render, remove} from '../util/dom-util.js';
import {sortFilmsDate} from '../util/date-time-util.js';
import {sortFilmsRank, sortFilmsCommentsAmount} from '../util/film.js';
import {updateItem, generateId} from '../util/common.js';
import FilmPresenter from './film.js';
import {SortType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;
const filmCardId = generateId();

const ExtraListTitles = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class FilmBoard {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._topFilmsCount = EXTRA_FILM_COUNT;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._comments = comments;
    this._sourcedFilms = films.slice();
    this._filmListComponent = new FilmListView(this._films);
    this._topRatedFilms = films.slice().sort(sortFilmsRank).slice(0, this._topFilmsCount);
    this._mostCommentedFilms = films.slice().sort(sortFilmsCommentsAmount).slice(0, this._topFilmsCount);
    this._allFilmsContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    this._topRatedContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    this._mostCommentedContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    this._renderFilmBoard();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm, updatedComments = this._comments) {
    const updatedCards = Object.keys(this._filmPresenter).filter((key) => this._filmPresenter[key].getFilmId() === updatedFilm.id);
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    updatedCards.forEach((card) => this._filmPresenter[card].init(updatedFilm, updatedComments));
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmsDate);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmsRank);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearFilmList();
    this._renderFilmsInLists();
  }

  _renderSort() {
    render(this._filmListContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(filmList, film) {
    const filmPresenter = new FilmPresenter(filmList, this._filmListContainer, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film, this._comments);
    this._filmPresenter[filmCardId()] = filmPresenter;
  }

  _renderFilms(from, to, array, list) {
    array
      .slice(from, to)
      .forEach((film) => this._renderFilm(list, film));
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP, this._films, this._allFilmsContainer);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmsInLists() {
    if (this._films.length > 0) {
      this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP), this._films, this._allFilmsContainer);
      this._renderFilms(0, this._topRatedFilms.length, this._topRatedFilms, this._topRatedContainer);
      this._renderFilms(0, this._mostCommentedFilms.lendth, this._mostCommentedFilms, this._mostCommentedContainer);
    }

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmBoard() {
    this._renderSort();
    render(this._filmListContainer, this._filmListComponent);
    render(this._filmListComponent, this._topRatedListComponent);
    render(this._filmListComponent, this._mostCommentedListComponent);
    this._renderFilmsInLists();
  }
}
