import React, { useState } from 'react';
import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, Pressable, Switch, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { images } from "../../constants";
import { useAuthContext } from '../../context/AuthContext';

const profile = () => {
  const { appUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);

  const {colorScheme, toggleColorScheme} = useColorScheme();

  return (
    <View className='flex-1 flex-grow flex-shrink px-4 bg-light dark:bg-dark'>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {/* IMAGE DISPLAY WITH USERNAME */}
        <View className='rounded-lg my-4 p-4 items-center justify-start'>
          <Image
            source={images.chatbot}
            className="w-24 h-24 rounded-full border-2 mb-3 border-gray-200 dark:border-white"
            resizeMode="contain"
          />
          <Text className='text-2xl text-black dark:text-white'>{username}</Text>
        </View>

        <View className='mb-10'>
          <Text className='my-2 mx-3 text-sm font-normal uppercase tracking-widest text-dark dark:text-light'>Account</Text>
          <SafeAreaView className="rounded-lg bg-light-MID dark:bg-dark-MID">
            {/* Change password */}
            <Pressable 
              style={({ pressed }) => [,
                pressed ? { backgroundColor: '#646464' } : {},
              ]} 
              onPress={() => {
                // handle onPress
                router.push("/account/change_password")
              }}
              className='flex-row items-center justify-start pr-4 h-12'
              accessibilityRole="link"
              accessibilityLabel="change password">
              <View
                className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-gray-500'>
                <Feather color="#fff" name="lock" size={20} />
              </View>
              <Text className="font-normal text-lg text-dark dark:text-light">Change password</Text>
              <View className='flex-grow flex-shrink' />
              <Feather color="#C6C6C6" name="chevron-right" size={24} />
            </Pressable>

            {/* Delete account */}
            <View className='border-t-2 border-t-neutral-200 dark:border-t-neutral-700'>
              <Pressable
                style={({ pressed }) => [,
                  pressed ? { backgroundColor: '#646464' } : {},
                ]} 
                onPress={() => {
                  // handle onPress
                  router.push("/account/delete_account")
                }}
                className='flex-row items-center justify-start pr-4 h-12'
                accessibilityRole="link"
                accessibilityLabel="delete account">
                <View
                  className='w-30 h-30 p-1 rounded justify-items-center align-middle ml-4 mr-4 bg-red-500'>
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
            <View>
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
                {/* <Feather color="#C6C6C6" name="chevron-right" size={24} /> */}
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
                <Switch
                  value={colorScheme === 'dark'}
                  onValueChange={toggleColorScheme}
                  accessibilityRole="switch"
                  accessibilityLabel="dark mode switch"
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
}

export default profile