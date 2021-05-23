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

export const commentId = generateId();

export const makeItemsUniq = (items) => [...new Set(items)];

export const isOnline = () => {
  return window.navigator.onLine;
};
