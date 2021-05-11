import Observer from '../util/observer.js';
import {FilterType} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    console.log('ffff');
    this._activeFilter = filter;
    console.log(filter);
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
