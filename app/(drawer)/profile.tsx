import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Pressable, Switch, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { icons } from "../../constants";

const profile = () => {
  const {colorScheme, toggleColorScheme} = useColorScheme();

  return (
    <View className='flex-1 flex-shrink flex-grow py-4 px-4 bg-light dark:bg-dark'>
      <ScrollView>
        {/* IMAGE DISPLAY */}
        <SafeAreaView className='rounded-lg mb-10 pt-3 pb-6 px-6'>
          <View className='px-3 pt-3 items-center justify-start'>
            <Image
              source={icons.chatbot}
              className="w-24 h-24 rounded-full border-2 mb-3 border-gray-200 dark:border-white"
              resizeMode="contain"
            />
            <Text className='text-2xl font-sans text-black dark:text-white'>John Doe</Text>
          </View>
        </SafeAreaView>

        <View className='pb-10'>
          <Text className='my-2 mx-3 text-sm font-normal uppercase tracking-widest text-dark dark:text-light'>Account</Text>
          <SafeAreaView className="rounded-lg bg-light-MID dark:bg-dark-MID">
              {/* Change password */}
              <View >
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  className='flex-row items-center justify-start pr-4 h-12'>
                  <View
                    className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-gray-500'>
                    <Feather color="#fff" name="lock" size={20} />
                  </View>
                  <Text className="font-normal text-lg text-dark dark:text-light">Change password</Text>
                  <View className='flex-grow flex-shrink' />
                  <Feather color="#C6C6C6" name="chevron-right" size={24} />
                </Pressable>
              </View>

              {/* Delete account */}
              <View >
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  className='flex-row items-center justify-start pr-4 h-12'>
                  <View
                    className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-red-700'>
                    <Feather color="#fff" name="trash-2" size={20} />
                  </View>
                  <Text className="font-normal text-lg text-dark dark:text-light">Delete account</Text>
                  <View className='flex-grow flex-shrink' />
                  <Feather color="#C6C6C6" name="chevron-right" size={24} />
                </Pressable>
              </View>
          </SafeAreaView>
        </View>

        <View>
          <Text className='my-2 mx-3 text-sm font-normal uppercase tracking-widest text-dark dark:text-light'>Preferences</Text>
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
            <View className='border-t-2 border-t-gray-200 dark:border-t-gray-500'>
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
        </View>
      </ScrollView>
    </View>
  );
}

export default profile