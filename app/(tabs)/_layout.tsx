import { StatusBar } from "expo-status-bar";
import React from 'react'
import { View, Text, Image, ImageSourcePropType } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../constants'

interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className='items-center justify-center gap-2'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#00A9E0',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#002F6C',
            borderTopWidth: 1,
            borderTopColor: '#232533'
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  )
}

export default TabsLayout