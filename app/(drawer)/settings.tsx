import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, Pressable, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function Example() {
  const {colorScheme, toggleColorScheme} = useColorScheme();
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  return (
    <View className='flex-1 py-4 px-4 flex-grow flex-shrink bg-light dark:bg-dark'>
      <ScrollView>
        <SafeAreaView className="rounded-lg bg-neutral-100 dark:bg-gray-600">
          {/* Select Language */}
          <View >
            <Pressable
              onPress={() => {
                // handle onPress
              }}
              className='flex-row items-center justify-start pr-4 h-12'>
              <View
                className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-orange-500'>
                <Feather color="#fff" name="globe" size={20} />
              </View>
              <Text className="font-medium text-lg text-dark dark:text-light">Language</Text>
              <View className='flex-grow flex-shrink' />
              <Text className="font-medium text-lg mr-2 text-dark dark:text-light">English</Text>
              <Feather color="#C6C6C6" name="chevron-right" size={24} />
            </Pressable>
          </View>

          {/* Dark Mode Toggle */}
          <View className='border-t-2 border-t-gray-200 dark:border-t-gray-500'>
            <View className='flex-row items-center justify-start pr-4 h-12'>
              <View
                className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-blue-600'>
                <Feather color="#fff" name="moon" size={20} />
              </View>

              <Text className="font-medium text-lg text-dark dark:text-light">Dark Mode</Text>
              <View className='flex-grow flex-shrink' />

              <Switch value={colorScheme === 'dark'} onChange={toggleColorScheme}></Switch>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({


  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
});