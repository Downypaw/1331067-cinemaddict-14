import AbstractView from './abstract.js';

const createTemplate = (films) => {
  let container = '';
  let title = 'There are no movies in our database';
  let hiddenClass = '';

  if (films.length > 0) {
    container = '<div class="films-list__container"></div>';
    title = 'All movies. Upcoming';
    hiddenClass = 'visually-hidden';
  }

  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title ${hiddenClass}">${title}</h2>

      ${container}
    </section>`;
};

export default class FilmList extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createTemplate(this._films);
  }
}
