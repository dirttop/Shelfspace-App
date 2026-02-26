import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps;

const Input = (props: InputProps) => {
  return (
    <TextInput
      {...props}
      placeholderClassName="text-zinc-500 font-sans"
      className={`bg-white border border-zinc-200 text-zinc-950 p-4 rounded-md mb-3 font-sans ${props.className || ''}`}
    />
  );
};

export default React.memo(Input);