import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { cssInterop } from "nativewind";
import { PressableScale } from "pressto";
import { Pressable } from 'react-native';
import AppText from './AppText';

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

export default function Search() {

  const handleSearch = () => {
    router.push('/search')
  }

  return (
    <Pressable
      onPress = {handleSearch}
      className="flex flex-row rounded-3xl bg-zinc-200/80 justify-between items-center p-1" 
    >
      <AppText >
        Search...
      </AppText>
      <Feather name="search" size={20} color="gray" />
    </Pressable>
  );
};