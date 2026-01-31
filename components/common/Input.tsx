import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  // We extend TextInputProps so we get value, onChangeText, etc. for free!
}

const Input = (props: InputProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#8E8E8E"
      className="bg-white dark:bg-[#121417] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-4 rounded-md mb-3"
    />
  );
};

export default Input;