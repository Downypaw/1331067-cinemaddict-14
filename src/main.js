import {createSiteMenuTemplate} from './view/site-menu.js';
import {createUserRankTemplate} from './view/user-rank.js';
import {createFilmListTemplate} from './view/film-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmInformationTemplate} from './view/film-information.js';
import {createTopRatedListTemplate} from './view/top-rated-list.js';
import {createMostCommentedListTemplate} from './view/most-commented-list.js';
import {createFilmCountTemplate} from './view/film-count.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {comments} from './mock/comment.js';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const sortFilmsRank = (filmA, filmB) => {
  const valueA = filmA.rank;
  const valueB = filmB.rank;

  return valueB - valueA;
};

const sortFilmsCommentsAmount = (filmA, filmB) => {
  const valueA = filmA.comments.length;
  const valueB = filmB.comments.length;

  return valueB - valueA;
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(filters.find((filter) => filter.name === 'History').count), 'beforeend');

const siteMainElement = document.querySelector('.main');
render(siteMainElement, createSiteMenuTemplate(filters), 'beforeend');
render(siteMainElement, createFilmListTemplate(films), 'beforeend');

const filmList = document.querySelector('.films-list__container');

const contentSection = document.querySelector('.films');
render(contentSection, createTopRatedListTemplate(), 'beforeend');
render(contentSection, createMostCommentedListTemplate(), 'beforeend');

const extraLists = document.querySelectorAll('.films-list--extra');

const topRatedList = extraLists[0].querySelector('.films-list__container');

const mostCommented = extraLists[1].querySelector('.films-list__container');


const filmCountWrapper = document.querySelector('.footer__statistics');

render(filmCountWrapper, createFilmCountTemplate(films), 'beforeend');

if(films.length > 0) {
  for (let i = 1; i < Math.min(films.length, FILM_COUNT_PER_STEP + 1); i++) {
    render(filmList, createFilmCardTemplate(films[i]), 'beforeend');
  }

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(topRatedList, createFilmCardTemplate(films.slice().sort(sortFilmsRank)[i]), 'beforeend');
  }

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(mostCommented, createFilmCardTemplate(films.slice().sort(sortFilmsCommentsAmount)[i]), 'beforeend');
  }

  render(siteMainElement,createFilmInformationTemplate(films[0], comments), 'beforeend');

  document.querySelector('.film-details').classList.add('visually-hidden');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(contentSection, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = contentSection.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmList, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}
