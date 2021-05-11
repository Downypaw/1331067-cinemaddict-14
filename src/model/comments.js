import Observer from '../util/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, filmUpdate, commentUpdate) {
    this._comments = [
      ...this._comments,
      commentUpdate,
    ];

    this._notify(updateType, filmUpdate);
  }

  // deleteComment(updateType, filmUpdate, commentUpdate) {
  //   const index = this._comments.findIndex((comment) => comment.id === commentUpdate.id);
  //
  //   if (index === -1) {
  //     throw new Error('Can\'t delete unexisting task');
  //   }
  //
  //   this._comments = [
  //     ...this._comments.slice(0, index),
  //     ...this._comments.slice(index + 1),
  //   ];
  //
  //   this._notify(updateType, filmUpdate);
  // }
}
