import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

export interface TabItem {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const Tabs = ({ items, activeTab, onTabChange, className }: TabsProps) => {
  return (
    <View className={`flex-row border-b border-slate-100 bg-white ${className}`}>
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={`flex-1 items-center py-3 border-b-2 ${
              isActive ? 'border-black' : 'border-transparent'
            }`}
          >
            <MaterialCommunityIcons 
              name={tab.icon} 
              size={24} 
              color={isActive ? 'black' : '#94a3b8'} 
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export default Tabs;