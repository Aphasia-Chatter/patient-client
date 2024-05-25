import { StyleSheet, ScrollView, ScrollViewProps, Image, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { AntDesign, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from "expo-router";

import { images } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomDrawerContent = (props: React.JSX.IntrinsicAttributes & ScrollViewProps & { children: React.ReactNode; } & React.RefAttributes<ScrollView>) => {
  const pathname = usePathname();
  useEffect(() => {
    console.log(pathname)
  })
  
  return(
    <DrawerContentScrollView {...props}>
      {/* APP NAME WITH LOGO */}
      <SafeAreaView className="pt-5 pb-5">
        <View className="flex-row items-center justify-center">
          <Image
            source={images.logoSmall}
            className="w-9 h-10"
            resizeMode="contain"
          />
          <Text className="ml-4 text-base">AphasiaChatter</Text>
        </View>
      </SafeAreaView>

      {/* CHATBOT DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <MaterialCommunityIcons name="robot-happy-outline" size={24} color={pathname == '/chatbot' ? '#fff' : '#000'}/>
        )}
        label={'Chatbot'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/chatbot' ? '#fff' : '#000'},   
        ]}
        style={{backgroundColor: pathname == '/chatbot' ? '#0072B2' : '#fff'}}
        onPress={() => {
          router.push('/(drawer)/chatbot')
        }}
      />

      {/* RESULTS DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <Foundation name="results" size={24} color={pathname == '/result' ? '#fff' : '#000'}/>
        )}
        label={'Results'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/result' ? '#fff' : '#000'},   
        ]}
        style={{backgroundColor: pathname == '/result' ? '#0072B2' : '#fff'}}
        onPress={() => {
          router.push('/(drawer)/result')
        }}
      />

      {/* PROFILE DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <AntDesign name="user" size={24} color={pathname == '/profile' ? '#fff' : '#000'}/>
        )}
        label={'Profile'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/profile' ? '#fff' : '#000'},   
        ]}
        style={{backgroundColor: pathname == '/profile' ? '#0072B2' : '#fff'}}
        onPress={() => {
          router.push('/(drawer)/profile')
        }}
      />
      
      {/* SETTINGS DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <Ionicons name="settings-outline" size={24} color={ pathname == '/settings' ? '#fff' : '#000'}/>
        )}
        label={'Settings'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/settings' ? '#fff' : '#000'},   
        ]}
        style={{backgroundColor: pathname == '/settings' ? '#0072B2' : '#fff'}}
        onPress={() => {
          router.push('/(drawer)/settings')
        }}
      />

      {/* LOGOUT DRAWER ITEM */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <DrawerItem
          icon={({color, size}) => (
            <MaterialCommunityIcons name="logout" size={24} color={ '#d55e00'}/>
          )}
          label={'Logout'}
          labelStyle={[
            styles.navItemLabel,
            { color: '#d55e00' },   
          ]}
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            router.push('/(auth)/login')
          }}
        />
      </View>
  </DrawerContentScrollView>
  )
}

const DrawerLayout = () => {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent children={undefined} {...props}/>} screenOptions={{headerTitleAlign: 'center'}}/>
  )
}

const styles = StyleSheet.create({
  navItemLabel: {marginLeft: -8, fontSize: 16}
})

export default DrawerLayout