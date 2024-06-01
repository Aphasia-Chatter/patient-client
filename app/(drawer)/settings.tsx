import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { useColorScheme } from 'nativewind';

const settings = () => {
  const {colorScheme, toggleColorScheme} = useColorScheme();

  return (
    <View className='flex-1 flex justify-center items-center space-y-6 bg-light dark:bg-dark'>
      <View className='flex-row justify-center items-center space-x-2'>
        <Text className='text-xl text-dark dark:text-light'>Dark Mode</Text>
        <Switch value={colorScheme === 'dark'} onChange={toggleColorScheme}></Switch>
      </View>
    </View>
  )
}

export default settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBackground: {
    backgroundColor: '#333',
  },
  lightBackground: {
    backgroundColor: '#fff',
  },
  textWhite: {
    color: 'white'
  },
  textBlack: {
    color: 'black'
  }
});