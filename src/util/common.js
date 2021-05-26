export const generateId = () => {
  let id = 1;

  return () => {
    return id++;
  };
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const isOnline = () => {
  return window.navigator.onLine;
};
