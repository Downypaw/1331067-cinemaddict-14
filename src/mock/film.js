import {comments} from './comment.js';
import {generateId, createText, getRandomSomething, getRandomInteger, getReleaseDate} from '../util.js';
import {COMMENT_COUNT, MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT, SENTENCES, NAMES} from '../const.js';

const MAX_VALUE = 3;
const MIN_VALUE = 1;
const MAX_RANK = 10;
const MIN_RANK = 0;

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

const generateDuration = () => {
  if(Boolean(getRandomInteger(0, 1)) === true) {
    const minute = getRandomInteger(0, 59);
    const hour = getRandomInteger(1, 3);
    return hour + 'h ' + minute + 'm';
  } else {
    const minute = getRandomInteger(30, 59);
    return minute + 'm';
  }
};

const getCommentsKeys = () => {
  const keys = [];
  const commentsAmount = getRandomInteger(0, COMMENT_COUNT);
  for (let i = 0; i < commentsAmount; i++) {
    const randomIndex = getRandomInteger(0, comments.length - 1);
    keys.push(comments[randomIndex].id);
  }
  return keys;
};

export const generateFilm = () => {
  const year = getRandomInteger(1980, 2021);
  return {
    id: filmId(),
    title: getRandomSomething(TITLES),
    originalTitle: getRandomSomething(ORIGINAL_TITLES),
    poster: getRandomSomething(POSTERS),
    genre: getRandomArray(MIN_VALUE, MAX_VALUE, GENRES),
    rank: getRandomFloat(MIN_RANK, MAX_RANK - 1),
    director: getRandomSomething(NAMES),
    screenwriters: getRandomArray(MIN_VALUE, MAX_VALUE, NAMES),
    cast: getRandomArray(MIN_VALUE, MAX_VALUE, NAMES),
    country: getRandomSomething(COUNTRIES),
    year: year,
    releaseDate: getReleaseDate(year),
    duration: generateDuration(),
    description: createText(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT, SENTENCES),
    ageRating: getRandomSomething(AGE_RATINGS),
    isWatchList: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    comments: getCommentsKeys(),
  };
};
