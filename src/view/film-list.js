export const createFilmListTemplate = (films) => {
  let container = 0;
  let title = 0;
  let hiddenClass = 0;

  if(films.length > 0) {
    container = '<div class="films-list__container"></div>';
    title = 'All movies. Upcoming';
    hiddenClass = 'visually-hidden';
  } else {
    container = '';
    title = 'There are no movies in our database';
    hiddenClass = '';
  }

  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title ${hiddenClass}">${title}</h2>

      ${container}
    </section>`;
};
