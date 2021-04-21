import FilmListView from '../view/film-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedListView from '../view/top-rated-list.js';
import MostCommentedListView from '../view/most-commented-list.js';
import SortView from '../view/sort.js';
import {render, onEscKeyDown, remove} from '../util/dom-util.js';
import {sortFilmsRank, sortFilmsCommentsAmount} from '../util/film.js';
import FilmPresenter from './film.js';


const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

export default class MovieBoard {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._renderedFilmsCount = EXTRA_FILM_COUNT;
    this._topFilmsCount = EXTRA_FILM_COUNT;
    this._topRatedListComponent = new TopRatedListView();
    this._mostCommentedListComponent = new MostCommentedListView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films, comments) {
    this._films = films.slice();
    this._comments = comments;
    this._movieListComponent = new FilmListView(this._films);
    this._topRatedFilms = films.slice().sort(sortFilmsRank);
    this._mostCommentedFilms = films.slice().sort(sortFilmsCommentsAmount);
    this._allFilmsContainer = this._movieListComponent.getElement().querySelector('.films-list__container');
    this._topRatedContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    this._mostCommentedContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    this._renderMovieBoard();
  }

  _renderSort() {
    render(this._movieListContainer, this._sortComponent);
  }

  _renderFilm(filmList, film) {
    const filmPresenter = new FilmPresenter(filmList, this._movieListContainer);
    filmPresenter.init(film, this._comments);
  }

  _renderFilms(from, to, array) {
    let list = [];
    switch (array) {
      case this._films:
        list = this._allFilmsContainer;
        break;
      case this._topRatedFilms:
        list = this._topRatedContainer;
        break;
      case this._mostCommentedFilms:
        list = this._mostCommentedContainer;
        break;
    }

    array
      .slice(from, to)
      .forEach((film) => this._renderFilm(list, film));
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP, this._films);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._movieListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmList() {
    if (this._films.length > 0) {
      this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP), this._films);
      this._renderFilms(0, this._topFilmsCount, this._topRatedFilms);
      this._renderFilms(0, this._topFilmsCount, this._mostCommentedFilms);
    }

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderMovieBoard() {
    this._renderSort();
    render(this._movieListContainer, this._movieListComponent);
    render(this._movieListComponent, this._topRatedListComponent);
    render(this._movieListComponent, this._mostCommentedListComponent);
    this._renderFilmList();
  }
}
