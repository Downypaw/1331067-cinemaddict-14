import AbstractView from './abstract.js';

const createTemplate = (extraListTitle) => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${extraListTitle}</h2>

    <div class="films-list__container"></div>
  </section>`;
};

export default class ExtraList extends AbstractView {
  constructor(extraListTitle) {
    super();
    this._extraListTitle = extraListTitle;
  }

  getTemplate() {
    return createTemplate(this._extraListTitle);
  }
}
