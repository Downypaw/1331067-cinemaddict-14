export const sortFilmsRank = (filmA, filmB) => {
  const valueA = filmA.rank;
  const valueB = filmB.rank;

  return valueB - valueA;
};

export const sortFilmsCommentsAmount = (filmA, filmB) => {
  const valueA = filmA.comments.length;
  const valueB = filmB.comments.length;

  return valueB - valueA;
};
