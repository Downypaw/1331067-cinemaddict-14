import StatsView from '../view/stat.js';
import SiteMenuView from '../view/site-menu.js';
import {render, replace, remove} from '../util/dom-util.js';
import {filter} from '../util/filter.js';
import {MenuItem, UpdateType} from '../const.js';

export default class SiteMenu {
  constructor(siteMenuContainer, filterModel, filmsModel, boardTab) {
    this._siteMenuContainer = siteMenuContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._boardTab = boardTab;
    this._statsTab = null;

    this._siteMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevSiteMenuComponent = this._siteMenuComponent;
    this._siteMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._filterComponent = this._siteMenuComponent.getElement().querySelector('.main-navigation__items');
    // this._siteMenuComponent.setStatisticClickHandler(this._handleStatisticClick);
    this._siteMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevSiteMenuComponent === null) {
      render(this._siteMenuContainer, this._siteMenuComponent);
      return;
    }

    if (this._siteMenuContainer.contains(prevSiteMenuComponent.getElement())) {
      replace(this._siteMenuComponent, prevSiteMenuComponent);
    }
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    if (filterType === MenuItem.STATISTICS) {
      this._statsTab = new StatsView(this._filmsModel.getFilms());
      render(this._siteMenuContainer, this._statsTab);
      this._boardTab.hide();
      this._statsTab.show();
    } else {
      this._statsTab.hide();
      this._boardTab.show();
      remove(this._statsTab);
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: MenuItem.ALL,
        name: 'All movies',
        count: filter[MenuItem.ALL](films).length,
      },
      {
        type: MenuItem.WATCHLIST,
        name: 'Watchlist',
        count: filter[MenuItem.WATCHLIST](films).length,
      },
      {
        type: MenuItem.HISTORY,
        name: 'History',
        count: filter[MenuItem.HISTORY](films).length,
      },
      {
        type: MenuItem.FAVORITES,
        name: 'Favorites',
        count: filter[MenuItem.FAVORITES](films).length,
      },
    ];
  }
}
