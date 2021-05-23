import FilmCountView from './view/film-count.js';
import FilmBoardPresenter from './presenter/film-board.js';
import UserRankPresenter from './presenter/user-rank.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import {render} from './util/dom-util.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {AUTHORIZATION, END_POINT, UpdateType} from './const.js';

const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmCountWrapper = document.querySelector('.footer__statistics');
const bodyElement = document.querySelector('body');

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const userRankPresenter = new UserRankPresenter(siteHeaderElement, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(bodyElement, siteMainElement, filmsModel, commentsModel, filterModel, apiWithProvider);
const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, filmBoardPresenter);

userRankPresenter.init();
siteMenuPresenter.init();
filmBoardPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(filmCountWrapper, new FilmCountView(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
