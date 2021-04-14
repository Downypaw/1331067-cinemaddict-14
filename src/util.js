import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
dayjs.extend(dayjsRandom);

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const generateId = () => {
  let id = 1;

  return () => {
    return id++;
  };
};

export const createText = (minSentenceCount, maxSentenceCount, array) => {
  const randomIndex = getRandomInteger(minSentenceCount, maxSentenceCount);

  let text = '';

  for (let i = 0; i < randomIndex; i++) {
    const index = getRandomInteger(0, array.length - 1);
    text += array[index];

    if (i !== randomIndex - 1) {
      text += ' ';
    }
  }

  return text;
};

export const getRandomInteger = (parameter1, parameter2) => {
  const min = Math.ceil(parameter1);
  const max = Math.floor(parameter2);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomDate = () => {
  return dayjs.between('2020-01-01', '2021-04-07').format('YYYY/MM/DD HH:mm');
};

export const getReleaseDate = (year) => {
  return dayjs.between('' + year + '-01-01', '' + year + '-12-31').format('DD MMMM YYYY');
};
