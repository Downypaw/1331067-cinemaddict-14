import {generateId, createText, getRandomSomething, getRandomDate} from '../util.js';
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
    emotion: getRandomSomething(EMOTIONS),
    author: getRandomSomething(NAMES),
    date: getRandomDate(),
  };
};

const comments = [];
for (let i = 0; i < COMMENT_COUNT; i++) {
  comments.push(generateComment());
}

export {comments};
