import CommentFill from './icons/comment-fill.svg';
import CommentOutline from './icons/comment-line.svg';
import GearFill from './icons/gear-fill.svg';
import GearOutline from './icons/gear-line.svg';
import HeartFill from './icons/heart-fill.svg';
import HeartOutline from './icons/heart-line.svg';
import Logo from './icons/logo.svg';
import ShareFill from './icons/share-fill.svg';
import ShareOutline from './icons/share-line.svg';
import BellFill from './icons/bell-fill.svg';
import BellOutline from './icons/bell-line.svg';
import Add from './icons/add.svg';


export const icons = {
  logo: Logo,
  heartFill: HeartFill,
  heartOutline: HeartOutline,
  commentFill: CommentFill,
  commentOutline: CommentOutline,
  shareOutline: ShareOutline,
  shareFill: ShareFill,
  gearOutline: GearOutline,
  gearFill: GearFill,
  bellFill: BellFill,
  bellOutline: BellOutline,
  add: Add,
};

export type IconName = keyof typeof icons;