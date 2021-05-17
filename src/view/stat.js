import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {defineUserRank} from '../util/film.js';
import {makeItemsUniq} from '../util/common.js';
import {filterWatchedFilms} from '../util/stat.js';
import {Periods, HOUR} from '../const.js';

const BAR_HEIGHT = 50;

const countGenres = (films) => {
  const watchedFilms = films.filter((film) => film.isWatched === true);
  const genresValues = watchedFilms.map((watchedFilm) => watchedFilm.genre);
  const uniqueGenres = makeItemsUniq([].concat(...genresValues));
  const filmsByGenresCount = uniqueGenres.map((genre) => {
    return {
      genre,
      count: watchedFilms.filter((watchedFilm) => watchedFilm.genre.includes(genre)).length,
    };
  });
  const sortedFilms = filmsByGenresCount.sort((a, b) => b.count - a.count);
  return sortedFilms ? sortedFilms : [];
};

const renderChart = (statisticCtx, films) => {
  const genresCount = countGenres(films);
  const genres = genresCount.map((genreCount) => genreCount.genre);
  const count = genresCount.map((genreCount) => genreCount.count);
  statisticCtx.style.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: count,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createTemplate = ({films, period}, filteredFilms) => {
  const rank = defineUserRank(films);
  const watchedFilmsCount = filteredFilms.filter((film) => film.isWatched === true).length;
  const totalDuration = filteredFilms.length ? filteredFilms.map((film) => film.duration).reduce((a, b) => a + b) : '';
  const topGenre = filteredFilms.length ? countGenres(filteredFilms)[0].genre : '';
  const hours = Math.floor(totalDuration / HOUR);
  const minutes = totalDuration % HOUR;
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" value="${Periods.ALL_TIME}" ${period === Periods.ALL_TIME ? ' checked' : ''} name="statistic-filter" id="statistic-all-time" value="all-time">
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" value="${Periods.TODAY}" ${period === Periods.TODAY ? ' checked' : ''} name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" value="${Periods.WEEK}" ${period === Periods.WEEK ? ' checked' : ''} name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" value="${Periods.MONTH}" ${period === Periods.MONTH ? ' checked' : ''} name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" value="${Periods.YEAR}" ${period === Periods.YEAR ? ' checked' : ''} name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = films.slice();

    this._data = {
      films: this._films,
      period: Periods.ALL_TIME,
    };

    this._chart = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setCharts();
    this._setPeriodChangeHandler();
  }

  removeElement() {
    super.removeElement();

    if(this._chart !== null) {
      this._chart = null;
    }
  }

  getTemplate() {
    return createTemplate(this._data, this._getWatchedFilms());
  }

  _getWatchedFilms() {
    return filterWatchedFilms(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this._setPeriodChangeHandler();
  }

  _periodChangeHandler(evt) {
    this.updateData({
      period: evt.target.value,
    });
  }

  _setPeriodChangeHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._periodChangeHandler);
  }

  _setCharts() {
    if(this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._getWatchedFilms());
  }
}
