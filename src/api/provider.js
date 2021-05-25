import FilmsModel from '../model/films.js';
import {isOnline} from '../util/common.js';
import {StoreElement} from '../const.js';

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const database = {};

const createStoreStructure = (storeElement, items, filmId) => {
  if (storeElement === StoreElement.FILMS) {
    database[storeElement] = items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {});
  } else {
    if (!database[storeElement]) {
      database[storeElement] = {};
    }
    database[storeElement][filmId] = items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {});
  }
  return database;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(StoreElement.FILMS, films);
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(Object.values(storeFilms[0]));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          const items = createStoreStructure(StoreElement.COMMENTS, comments, filmId);
          this._store.setItems(items);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems())[1];
    return Promise.resolve(Object.values(storeComments[filmId]));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(database[StoreElement.FILMS][updatedFilm.id], FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    database[StoreElement.FILMS][film.id] = FilmsModel.adaptToServer(Object.assign({}, film));
    const items = createStoreStructure(StoreElement.FILMS, Object.values(database[StoreElement.FILMS]));
    this._store.setItems(items);
    return Promise.resolve(film);
  }

  addComment(comment) {
    if (isOnline()) {
      return this._api.addComment(comment);
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(Object.values(storeFilms[0]))
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure(StoreElement.FILMS, updatedFilms);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
