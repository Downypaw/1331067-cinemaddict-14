import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
dayjs.extend(dayjsRandom);

export const getRandomDate = () => {
  return dayjs.between('2020-01-01', '2021-04-07').format('YYYY/MM/DD HH:mm');
};

export const getReleaseDate = (year) => {
  return dayjs.between('' + year + '-01-01', '' + year + '-12-31').format('DD MMMM YYYY');
};

export const getCurrentDate = () => {
  return dayjs().format('YYYY/MM/DD HH:mm');
};
