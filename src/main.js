import FilmCountView from './view/film-count.js';
import FilmBoardPresenter from './presenter/film-board.js';
import UserRankPresenter from './presenter/user-rank.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import {render} from './util/dom-util.js';
import Api from './api.js';
import {AUTHORIZATION, END_POINT, UpdateType} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmCountWrapper = document.querySelector('.footer__statistics');
const bodyElement = document.querySelector('body');

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const userRankPresenter = new UserRankPresenter(siteHeaderElement, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(bodyElement, siteMainElement, filmsModel, commentsModel, filterModel, api);
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
