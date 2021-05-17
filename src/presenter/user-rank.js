import UserRankView from '../view/user-rank.js';
import {render, replace, remove} from '../util/dom-util.js';
import {defineUserRank} from '../util/film.js';

export default class UserRank {
  constructor(userRankContainer, filmsModel) {
    this._userRankContainer = userRankContainer;
    this._filmsModel = filmsModel;

    this._userRankComponent = null;

    this._handleFilmChange = this._handleFilmChange.bind(this);

    this._filmsModel.addObserver(this._handleFilmChange);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const prevUserRankComponent = this._userRankComponent;

    this._userRankComponent = new UserRankView(defineUserRank(films));
    if (prevUserRankComponent === null) {
      render(this._userRankContainer, this._userRankComponent);
      return;
    }

    replace(this._userRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  }

  _handleFilmChange() {
    this.init();
  }
}
