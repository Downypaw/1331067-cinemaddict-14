import Observer from '../util/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        title: film.film_info.title,
        originalTitle: film.film_info.alternative_title,
        poster: film.film_info.poster,
        genre: film.film_info.genre,
        rank: film.film_info.total_rating,
        director: film.film_info.director,
        screenwriters: film.film_info.writers,
        cast: film.film_info.actors,
        country: film.film_info.release.release_country,
        year: new Date(film.film_info.release.date).getFullYear(),
        releaseDate: new Date(film.film_info.release.date),
        duration: film.film_info.runtime,
        description: film.film_info.description,
        ageRating: film.film_info.age_rating,
        isWatchList: film.user_details.watchlist,
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchingDate: film.user_details.watching_date,
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        "film_info": {
          "title": film.title,
          "alternative_title": film.originalTitle,
          "total_rating": film.rank,
          "poster": film.poster,
          "age_rating": film.ageRating,
          "director": film.director,
          "writers": film.screenwriters,
          "actors": film.cast,
          "release": {
            "date": new Date(film.releaseDate).toISOString(),
            "release_country": film.country,
          },
          "runtime": film.duration,
          "genre": film.genre,
          "description": film.description,
        },
        "user_details": {
          "watchlist": film.isWatchList,
          "already_watched": film.isWatched,
          "watching_date": new Date(film.watchingDate).toISOString(),
          "favorite": film.isFavorite,
        }
      },
    );

    delete adaptedFilm.year;
    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.poster;
    delete adaptedFilm.genre;
    delete adaptedFilm.rank;
    delete adaptedFilm.director;
    delete adaptedFilm.screenwriters;
    delete adaptedFilm.cast;
    delete adaptedFilm.country;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.duration;
    delete adaptedFilm.description;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.isWatchList;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }
}
