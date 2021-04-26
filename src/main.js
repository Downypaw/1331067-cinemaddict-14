import SiteMenuView from './view/site-menu.js';
import UserRankView from './view/user-rank.js';
import FilmCountView from './view/film-count.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {comments} from './mock/comment.js';
import FilmBoardPresenter from './presenter/film-board.js';
import {render} from './util/dom-util.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmCountWrapper = document.querySelector('.footer__statistics');

const filmBoardPresenter = new FilmBoardPresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(filters.find((filter) => filter.name === 'History').count));

render(siteMainElement, new SiteMenuView(filters));

filmBoardPresenter.init(films, comments);

render(filmCountWrapper, new FilmCountView(films.length));
