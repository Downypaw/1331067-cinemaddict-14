import {comments} from './comment.js';
import {generateId, createText, getRandomArrayElement, getRandomInteger} from '../util/common.js';
import {getReleaseDate} from '../util/date-time-util.js';
import {COMMENT_COUNT, MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT, SENTENCES, NAMES} from '../const.js';

const MAX_VALUE = 3;
const MIN_VALUE = 1;
const MAX_RANK = 10;
const MIN_RANK = 0;
const MAX_DURATION = 240;
const MIN_DURATION = 30;

const ORIGINAL_TITLES = [
  'The Shawshank Redemption',
  'Green Mile',
  'The Lord of the Rings: The Return of the King',
  'Back to the Future',
  'Coco',
];

const TITLES = [
  'Побег из Шоушенка',
  'Зелёная миля',
  'Властелин колец: Возвращение короля',
  'Назад в будущее',
  'Тайна Коко',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
];

const GENRES = [
  'аниме',
  'биографический',
  'боевик',
  'вестерн',
  'военный',
];

const COUNTRIES = [
  'USA',
  'England',
  'France',
];

const AGE_RATINGS = [
  '0+',
  '6+',
  '12+',
  '16+',
  '18+',
];

const getRandomFloat = (parameter1, parameter2) => {
  return (Math.random() * (parameter2 - parameter1 + 1) + parameter1).toFixed(1);
};

const filmId = generateId();

const getRandomArray = (minIndex, maxIndex, array) => {
  const randomIndex = getRandomInteger(minIndex, maxIndex);
  const outputArray = [];
  for (let i = 0; i < randomIndex; i++) {
    const index = getRandomInteger(0, array.length - 1);
    outputArray.push(array[index]);
  }
  return outputArray;
};

const getCommentsKeys = () => {
  const keys = [];
  const commentsAmount = getRandomInteger(0, COMMENT_COUNT);
  while (keys.length <= commentsAmount) {
    const randomIndex = getRandomInteger(0, comments.length - 1);
    const commentIndex = comments[randomIndex].id;
    const isRepeat = keys.some((element) => {
      return element.id === commentIndex;
    });

    if(!isRepeat) {
      keys.push(commentIndex);
    }
  }
  return keys;
};

export const generateFilm = () => {
  const year = getRandomInteger(1980, 2021);
  return {
    id: filmId(),
    title: getRandomArrayElement(TITLES),
    originalTitle: getRandomArrayElement(ORIGINAL_TITLES),
    poster: getRandomArrayElement(POSTERS),
    genre: getRandomArray(MIN_VALUE, MAX_VALUE, GENRES),
    rank: getRandomFloat(MIN_RANK, MAX_RANK - 1),
    director: getRandomArrayElement(NAMES),
    screenwriters: getRandomArray(MIN_VALUE, MAX_VALUE, NAMES),
    cast: getRandomArray(MIN_VALUE, MAX_VALUE, NAMES),
    country: getRandomArrayElement(COUNTRIES),
    year: year,
    releaseDate: getReleaseDate(year),
    duration: getRandomInteger(MIN_DURATION, MAX_DURATION),
    description: createText(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT, SENTENCES),
    ageRating: getRandomArrayElement(AGE_RATINGS),
    isWatchList: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    comments: getCommentsKeys(),
  };
};
