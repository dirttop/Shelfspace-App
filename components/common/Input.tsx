import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  // We extend TextInputProps so we get value, onChangeText, etc. for free!
}

const Input = (props: InputProps) => {
  return (
    <TextInput
      {...props}
      {...props}
      placeholderClassName="text-zinc-500 dark:text-zinc-400"
      className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-gray-50 p-4 rounded-md mb-3"
    />
  );
};

export default Input;