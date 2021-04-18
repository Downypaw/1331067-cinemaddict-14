import AbstractView from './abstract.js';

const createTemplate = (filmCount) => {
  return `<p>${filmCount} movies inside</p>`;
};

export default class FilmCount extends AbstractView {
  constructor(filmCount) {
    super();
    this._filmCount = filmCount;
  }

  getTemplate() {
    return createTemplate(this._filmCount);
  }
}
