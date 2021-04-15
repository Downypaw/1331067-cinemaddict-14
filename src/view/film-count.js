import {createElement} from '../dom-util.js';

const createTemplate = (filmCount) => {
  return `<p>${filmCount} movies inside</p>`;
};

export default class FilmCount {
  constructor(filmCount) {
    this._filmCount = filmCount;
    this._element = null;
  }

  getTemplate() {
    return createTemplate(this._filmCount);
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
