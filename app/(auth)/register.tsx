import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import Checkbox from '@/components/common/Checkbox';
import Buttons from '@/components/common/Buttons';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [terms, setTerms] = useState(false);

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-2xl mb-5 text-center font-bold">
        Register
      </Text>

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        className="border border-gray-300 p-2 mb-2 rounded-lg"
        placeholder="Last Name"
        value={lastName}
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
        value={confirmEmail}
        onChangeText={setConfirmEmail}
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

      <Checkbox
        value={terms}
        label="I agree to the terms and conditions"
        onValueChange={setTerms}
      />

      <Button title="Sign Up" onPress={() => {}} />
    </View>
  );
};

export default RegisterScreen;