const COMMENT_COUNT = 20;
const MAX_SENTENCE_COUNT = 5;
const MIN_SENTENCE_COUNT = 1;

const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const NAMES = [
  'Кристофер Нолан',
  'Стивен Спилберг',
  'Мартин Скорсезе',
  'Стэнли Кубрик',
  'Альфред Хичкок',
  'Билли Уайлдер',
  'Джоэл Коэн',
  'Роберт Таун',
  'Квентин Тарантино',
  'Фрэнсис Форд Коппола',
  'Брэд Питт',
  'Леонардо Ди Каприо',
  'Анджелина Джоли',
  'Том Круз',
  'Марго Робби',
];

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export {COMMENT_COUNT, MAX_SENTENCE_COUNT, MIN_SENTENCE_COUNT, SENTENCES, NAMES, SortType, UserAction, UpdateType, FilterType};
