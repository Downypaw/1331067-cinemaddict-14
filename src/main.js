import SiteMenuView from './view/site-menu.js';
import UserRankView from './view/user-rank.js';
import FilmCountView from './view/film-count.js';
import {generateFilm} from './mock/film.js';
import {comments} from './mock/comment.js';
import FilmBoardPresenter from './presenter/film-board.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import {render} from './util/dom-util.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmCountWrapper = document.querySelector('.footer__statistics');

render(siteHeaderElement, new UserRankView(films.filter((film) => film.isWatched === true).length));

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

filterPresenter.init();
filmBoardPresenter.init();

render(filmCountWrapper, new FilmCountView(films.length));
