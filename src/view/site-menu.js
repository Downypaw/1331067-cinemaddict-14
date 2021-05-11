import AbstractView from './abstract.js';
import {FilterType} from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const counter = name !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : '';
  let dataFilterType = '';
  switch(name) {
    case FilterType.ALL:
      dataFilterType = `${FilterType.ALL}`;
      break;
    case FilterType.WATCHLIST:
      dataFilterType = `${FilterType.WATCHLIST}`;
      break;
    case FilterType.HISTORY:
      dataFilterType = `${FilterType.HISTORY}`;
      break;
    case FilterType.FAVORITES:
      dataFilterType = `${FilterType.FAVORITES}`;
      break;
  }

  return `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type = ${dataFilterType}>${name} ${counter}</a>`;
};

const createTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    console.log(filters);
    console.log(currentFilterType);
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    console.log(evt.target.dataset.filterType);
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
