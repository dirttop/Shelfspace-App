/* eslint-disable react/display-name */
import {
  BookOpen,
  Heart,
  MessageCircle,
  Share,
  Settings,
  Bell,
  Plus,
  Package,
} from 'lucide-react-native';
import React from 'react';

const createLucideIcon = (IconComponent: React.ElementType, filled: boolean = false) => {
  return (props: { color?: string; width?: string | number; height?: string | number; size?: number; className?: string; style?: any }) => {
    const size = props.size || 24;
    return (
      <IconComponent 
        color={props.color || 'black'} 
        size={size as number} 
        fill={filled ? (props.color || 'black') : 'none'}
        className={props.className} 
        style={props.style} 
      />
    );
  };
};

const Icons = {
  logo: createLucideIcon(BookOpen),
  heartFill: createLucideIcon(Heart, true),
  heartOutline: createLucideIcon(Heart, false),
  commentFill: createLucideIcon(MessageCircle, true),
  commentOutline: createLucideIcon(MessageCircle, false),
  shareOutline: createLucideIcon(Share, false),
  shareFill: createLucideIcon(Share, true),
  gearOutline: createLucideIcon(Settings, false),
  gearFill: createLucideIcon(Settings, true),
  bellFill: createLucideIcon(Bell, true),
  bellOutline: createLucideIcon(Bell, false),
  add: createLucideIcon(Plus),
  package: createLucideIcon(Package),
};

export default Icons;