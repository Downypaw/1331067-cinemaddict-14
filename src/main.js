import FilmCountView from './view/film-count.js';
// import {generateFilm} from './mock/film.js';
// import {comments} from './mock/comment.js';
import FilmBoardPresenter from './presenter/film-board.js';
import UserRankPresenter from './presenter/user-rank.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import {render} from './util/dom-util.js';
import {formatReleaseDate, formatCommentDate} from './util/date-time-util.js';
import Api from './api.js';
import {AUTHORIZATION, END_POINT, UpdateType} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmCountWrapper = document.querySelector('.footer__statistics');

// const films = new Array(FILM_COUNT).fill().map(generateFilm);

const api = new Api(END_POINT, AUTHORIZATION);

// films.forEach((film) => {
//   film.releaseDate = formatReleaseDate(film.releaseDate);
// });
const filmsModel = new FilmsModel();


// comments.forEach((comment) => comment.date = formatCommentDate(comment.date));
const commentsModel = new CommentsModel();
// commentsModel.setComments(comments);

const filterModel = new FilterModel();

const userRankPresenter = new UserRankPresenter(siteHeaderElement, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, filmBoardPresenter);

userRankPresenter.init();
siteMenuPresenter.init();
filmBoardPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(filmCountWrapper, new FilmCountView(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
