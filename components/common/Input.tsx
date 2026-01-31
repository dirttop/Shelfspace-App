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
      placeholderClassName="text-muted-foreground"
      className="bg-background border border-input text-foreground p-4 rounded-md mb-3"
    />
  );
};

export default Input;