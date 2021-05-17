import AbstractView from './abstract.js';
import {MenuItem} from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const counter = name !== MenuItem.ALL ? `<span class="main-navigation__item-count">${count}</span>` : '';
  let dataFilterType = '';
  switch(name) {
    case MenuItem.ALL:
      dataFilterType = `${MenuItem.ALL}`;
      break;
    case MenuItem.WATCHLIST:
      dataFilterType = `${MenuItem.WATCHLIST}`;
      break;
    case MenuItem.HISTORY:
      dataFilterType = `${MenuItem.HISTORY}`;
      break;
    case MenuItem.FAVORITES:
      dataFilterType = `${MenuItem.FAVORITES}`;
      break;
  }

  return `<a href="#${name}" class="main-navigation__item${type === currentFilterType ? ' main-navigation__item--active' : ''}" data-filter-type="${dataFilterType}">${name} ${counter}</a>`;
};

const createTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentFilterType === MenuItem.STATISTICS ? 'main-navigation__additional--active' : ''}" data-filter-type="${MenuItem.STATISTICS}">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statisticClickHandler = this._statisticClickHandler.bind(this);
  }

  getTemplate() {
    return createTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.closest('a')) {
      this._callback.filterTypeChange(evt.target.closest('a').dataset.filterType);
      evt.preventDefault();
      this.getElement().querySelector('.main-navigation__additional').classList.remove('main-navigation__additional--active');
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setStatisticClickHandler(callback) {
    this._callback.statisticClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statisticClickHandler);
  }

  _statisticClickHandler(evt) {
    evt.preventDefault();
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      if (item.classList.contains('main-navigation__item--active')) {
        item.classList.remove('main-navigation__item--active');
      }
    });
    this.getElement().querySelector('.main-navigation__additional').classList.add('main-navigation__additional--active');
    this._callback.statisticClick( );
  }
}
