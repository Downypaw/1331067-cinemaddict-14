import Noty from 'noty';

export const getUpdateError = () => {
  new Noty({
    text: 'This is an error in update data!',
  }).show();
};

export const getCommentLoadError = () => {
  new Noty({
    text: 'This is an error in loading comments!',
  }).show();
};
