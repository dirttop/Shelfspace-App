import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-2xl mb-5 text-center font-bold">
        Login
      </Text>

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Log In" onPress={() => {}} />
    </View>
  );
}