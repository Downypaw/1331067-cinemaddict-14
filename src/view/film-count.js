import {createElement} from '../util.js';

const createFilmCountTemplate = (filmCount) => {
  return `<p>${filmCount} movies inside</p>`;
};

export default class FilmCount {
  constructor(filmCount) {
    this._filmCount = filmCount;
    this._element = null;
  }

  getTemplate() {
    return createFilmCountTemplate(this._filmCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
