import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, Pressable, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

const preference = () => {
  const {colorScheme, toggleColorScheme} = useColorScheme();

  return (
    <View className='flex-1 flex-grow flex-shrink px-4 py-4 bg-light dark:bg-dark'>
      <ScrollView>
        <SafeAreaView className="rounded-lg bg-light-MID dark:bg-dark-MID">
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
              <Text className="font-normal text-lg text-dark dark:text-light">Language</Text>
              <View className='flex-grow flex-shrink' />
              <Text className="font-normal text-lg mr-2 text-dark dark:text-light">English</Text>
              <Feather color="#C6C6C6" name="chevron-right" size={24} />
            </Pressable>
          </View>

          {/* Dark Mode Toggle */}
          <View className='border-t-2 border-t-neutral-200 dark:border-t-neutral-700'>
            <View className='flex-row items-center justify-start pr-4 h-12'>
              <View
                className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-blue-600'>
                <Feather color="#fff" name="moon" size={20} />
              </View>

              <Text className="font-normal text-lg text-dark dark:text-light">Dark Mode</Text>
              <View className='flex-grow flex-shrink' />

              <Switch value={colorScheme === 'dark'} onChange={toggleColorScheme}></Switch>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export default preference