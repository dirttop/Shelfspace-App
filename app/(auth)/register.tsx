import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-2xl mb-5 text-center font-bold">
        Register
      </Text>

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Username"
        value={email}
        onChangeText={setUsername}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="First Name"
        value={email}
        onChangeText={setFirstName}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Last Name"
        value={email}
        onChangeText={setLastName}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Confirm Email"
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

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Sign Up" onPress={() => {}} />
    </View>
  );
};

export default RegisterScreen;