import React from 'react';
import { SafeAreaView, View, ScrollView, Text, Pressable, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind'; // Ensure this is imported correctly

const Preference = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className='flex-1 flex-grow flex-shrink px-4 py-4 bg-light dark:bg-dark'>
      <ScrollView>
        <SafeAreaView className="rounded-lg bg-light-MID dark:bg-dark-MID">
          <View>
            <Pressable onPress={() => {}}>
              <View className='w-30 h-30 p-1 rounded bg-orange-500'>
                <Feather color="#fff" name="globe" size={20} />
              </View>
              <Text>Language</Text>
            </Pressable>
          </View>
          <View className='border-t-2 border-neutral-200 dark:border-neutral-700'>
            <View>
              <View className='w-30 h-30 p-1 rounded bg-blue-600'>
                <Feather color="#fff" name="moon" size={20} />
              </View>
              <Text>Dark Mode</Text>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
                accessibilityRole="switch"
                accessibilityLabel="dark mode switch"
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  ) 
}

export default Preference
