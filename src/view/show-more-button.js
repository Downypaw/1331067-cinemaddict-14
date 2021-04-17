import AbstractView from './abstract.js';

const createTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreButton extends AbstractView {
  getTemplate() {
    return createTemplate();
  }
}
