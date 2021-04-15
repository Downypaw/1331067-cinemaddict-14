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
import {render, onEscKeyDown} from './dom-util.js';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmCountWrapper = document.querySelector('.footer__statistics');

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmInformationPopup = new FilmInformationView(film, comments).getElement();

  const showPopup = () => {
    siteMainElement.appendChild(filmInformationPopup);
    document.addEventListener('keydown', (evt) => {
      onEscKeyDown(evt, closePopup);
    });
  };

  const closePopup = () => {
    if (filmInformationPopup.parentNode) {
      siteMainElement.removeChild(filmInformationPopup);
    }
  };

  const onFilmCardClick = () => {
    showPopup();
    filmInformationPopup.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
    });
  };

  filmComponent.getElement().querySelector('.film-card__title').addEventListener('click', onFilmCardClick);

  filmComponent.getElement().querySelector('.film-card__poster').addEventListener('click', onFilmCardClick);

  filmComponent.getElement().querySelector('.film-card__comments').addEventListener('click', onFilmCardClick);

  render(filmListElement, filmComponent.getElement());
};

const renderFilmList = (films) => {
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

  render(siteMainElement, new SiteMenuView(filters).getElement());
  render(siteMainElement, new SortView().getElement());
  render(siteMainElement, new FilmListView(films).getElement());

  const filmList = document.querySelector('.films-list__container');

  const contentSection = document.querySelector('.films');
  render(contentSection, new TopRatedListView().getElement());
  render(contentSection, new MostCommentedListView().getElement());

  const extraLists = document.querySelectorAll('.films-list--extra');

  const topRatedList = extraLists[0].querySelector('.films-list__container');

  const mostCommented = extraLists[1].querySelector('.films-list__container');

  if(films.length > 0) {
    for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
      renderFilm(filmList, films[i]);
    }

    for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
      renderFilm(topRatedList, films.slice().sort(sortFilmsRank)[i]);
    }

    for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
      renderFilm(mostCommented, films.slice().sort(sortFilmsCommentsAmount)[i]);
    }
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    render(contentSection, new ShowMoreButtonView().getElement());

    const showMoreButton = contentSection.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmList, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }
};

render(siteHeaderElement, new UserRankView(filters.find((filter) => filter.name === 'History').count).getElement());

renderFilmList(films);

render(filmCountWrapper, new FilmCountView(films.length).getElement());
