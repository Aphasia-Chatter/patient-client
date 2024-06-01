import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

const result = () => {
  return (
    <View className='flex-1 flex justify-center items-center space-y-6 bg-light dark:bg-dark'>
      <StatusBar />
      <View className='flex-row justify-center items-center space-x-2'>
        <Text className='text-xl text-dark dark:text-light'>Dark Mode</Text>
      </View>
      <Text className='mx-4 text-justify text-dark dark:text-light'>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
      </Text>
    </View>
  );
}

export default result