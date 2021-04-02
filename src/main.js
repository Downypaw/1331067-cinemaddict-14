import {createSiteMenuTemplate} from './view/site-menu.js';
import {createUserRankTemplate} from './view/user-rank.js';
import {createFilmListTemplate} from './view/film-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmInformationTemplate} from './view/film-information.js';
import {createTopRatedListTemplate} from './view/top-rated-list.js';
import {createMostCommentedListTemplate} from './view/most-commented-list.js';
import {createFilmCountTemplate} from './view/film-count.js';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');

const siteMainElement = document.querySelector('.main');
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createFilmListTemplate(), 'beforeend');

const filmList = document.querySelector('.films-list__container');

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmList, createFilmCardTemplate(), 'beforeend');
}

const contentSection = document.querySelector('.films');
render(contentSection, createShowMoreButtonTemplate(), 'beforeend');
render(contentSection, createTopRatedListTemplate(), 'beforeend');
render(contentSection, createMostCommentedListTemplate(), 'beforeend');

const extraLists = document.querySelectorAll('.films-list--extra');

const topRatedList = extraLists[0].querySelector('.films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
  render(topRatedList, createFilmCardTemplate(), 'beforeend');
}

const mostCommented = extraLists[1].querySelector('.films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
  render(mostCommented, createFilmCardTemplate(), 'beforeend');
}

const filmCountWrapper = document.querySelector('.footer__statistics');

render(filmCountWrapper, createFilmCountTemplate(), 'beforeend');
