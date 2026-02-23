import CommentFill from './icons/comment-fill.svg';
import CommentOutline from './icons/comment-line.svg';
import HeartFill from './icons/heart-fill.svg';
import HeartOutline from './icons/heart-line.svg';
import Logo from './icons/logo.svg';

export const icons = {
  logo: Logo,
  heartFill: HeartFill,
  heartOutline: HeartOutline,
  commentFill: CommentFill,
  commentOutline: CommentOutline,
};

export type IconName = keyof typeof icons;