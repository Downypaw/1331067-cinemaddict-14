import AbstractView from './abstract.js';

const createTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`;
};

export default class MostCommentedList extends AbstractView {
  getTemplate() {
    return createTemplate();
  }
}
