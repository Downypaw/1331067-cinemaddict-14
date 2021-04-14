import SiteMenuView from './view/site-menu.js';
import UserRankView from './view/user-rank.js';
import FilmListView from './view/film-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmInformationView from './view/film-information.js';
import TopRatedListView from './view/top-rated-list.js';
import MostCommentedListView from './view/most-commented-list.js';
import FilmCountView from './view/film-count.js';
import SortView from './view/sort.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {comments} from './mock/comment.js';
import {render, RenderPosition} from './util.js';

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

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, new UserRankView(filters.find((filter) => filter.name === 'History').count).getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new SiteMenuView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmListView(films).getElement(), RenderPosition.BEFOREEND);

const filmList = document.querySelector('.films-list__container');

const contentSection = document.querySelector('.films');
render(contentSection, new TopRatedListView().getElement(), RenderPosition.BEFOREEND);
render(contentSection, new MostCommentedListView().getElement(), RenderPosition.BEFOREEND);

const extraLists = document.querySelectorAll('.films-list--extra');

const topRatedList = extraLists[0].querySelector('.films-list__container');

const mostCommented = extraLists[1].querySelector('.films-list__container');


const filmCountWrapper = document.querySelector('.footer__statistics');

render(filmCountWrapper, new FilmCountView(films.length).getElement(), RenderPosition.BEFOREEND);

if(films.length > 0) {
  for (let i = 1; i < Math.min(films.length, FILM_COUNT_PER_STEP + 1); i++) {
    render(filmList, new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
  }

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(topRatedList, new FilmCardView(films.slice().sort(sortFilmsRank)[i]).getElement(), RenderPosition.BEFOREEND);
  }

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(mostCommented, new FilmCardView(films.slice().sort(sortFilmsCommentsAmount)[i]).getElement(), RenderPosition.BEFOREEND);
  }

  render(siteMainElement, new FilmInformationView(films[0], comments).getElement(), RenderPosition.BEFOREEND);

  document.querySelector('.film-details').classList.add('visually-hidden');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(contentSection, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = contentSection.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmList, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}
