import {generateId, createText, getRandomArrayElement} from '../util.js';
import {getRandomDate} from '../date-time-util.js';
import {COMMENT_COUNT, MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT, SENTENCES, NAMES} from '../const.js';

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const commentId = generateId();

const generateComment = () => {
  return {
    id: commentId(),
    text: createText(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT, SENTENCES),
    emotion: getRandomArrayElement(EMOTIONS),
    author: getRandomArrayElement(NAMES),
    date: getRandomDate(),
  };
};

const comments = [];
for (let i = 0; i < COMMENT_COUNT; i++) {
  comments.push(generateComment());
}

export {comments};
