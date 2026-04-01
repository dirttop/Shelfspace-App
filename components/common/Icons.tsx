/* eslint-disable react/display-name */
import Feather from '@expo/vector-icons/Feather';
import React from 'react';

const createIcon = (name: React.ComponentProps<typeof Feather>['name']) => {
  return (props: { color?: string; width?: string | number; height?: string | number; size?: number; className?: string; style?: any }) => {
    const size = props.size || 24;
    return <Feather name={name} size={size as number} color={props.color || 'black'} className={props.className} style={props.style} />;
  };
};

const Icons = {
  logo: createIcon('book-open'),
  heartFill: createIcon('heart'),
  heartOutline: createIcon('heart'),
  commentFill: createIcon('message-circle'),
  commentOutline: createIcon('message-circle'),
  shareOutline: createIcon('share'),
  shareFill: createIcon('share'),
  gearOutline: createIcon('settings'),
  gearFill: createIcon('settings'),
  bellFill: createIcon('bell'),
  bellOutline: createIcon('bell'),
  add: createIcon('plus'),
};

export default Icons;