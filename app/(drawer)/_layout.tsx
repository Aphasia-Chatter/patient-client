import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, ScrollViewProps, Image, Text, View, SafeAreaView } from 'react-native'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from "expo-router";
import { useColorScheme } from 'nativewind';

import { images } from "../../constants";
import { useAuthContext } from '../../context/AuthContext';
import { fetchValue, saveValue } from "../../utils/SecureStore";

const CustomDrawerContent = (props: React.JSX.IntrinsicAttributes & ScrollViewProps & { children: React.ReactNode; } & React.RefAttributes<ScrollView>) => {
  const { appUser, setAppUser } = useAuthContext();
  const [isSubmitting, setSubmitting] = useState(false);

  const { colorScheme } = useColorScheme();
  const pathname = usePathname();
  useEffect(() => {
    console.log(pathname)
  })

  const logout = async () => {
    setSubmitting(true);

    try {
      // Send POST request for patient logout
      // Use ipconfig to find ip address of your pc/emulator in the local network
      const response = await fetch('http://10.0.2.2:44818/api/patient/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: appUser?.username,
          sessionToken: appUser?.sessionToken
        }),
      });

      const jsonResponse = await response.json();

      if (response.ok) {
        // Delete username and session token from local storage in device
        setAppUser(null)
        await saveValue("AppUser", null)

        // Handle successful logout
        router.replace('/(auth)/login')
      }
    } catch (error) { // Error such as Network request failed
      console.error('Error:', error);
      
    } finally {
      setSubmitting(false);
    }
  };
  
  return(
    <DrawerContentScrollView {...props}>
      {/* APP NAME WITH LOGO */}
      <SafeAreaView className="flex-row items-center justify-center mb-6">
        <Image
          source={images.logoSmall}
          className="w-10 h-10"
          resizeMode="contain"
        />
        <Text className="text-xl ml-2 text-dark dark:text-light">AphasiaChatter</Text>
      </SafeAreaView>

      {/* CHATBOT DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <View
          className='w-30 h-30 p-1 rounded justify-items-center align-middle bg-red-500'>
            <MaterialCommunityIcons name="robot-happy-outline" size={24} color='#fff'/>
          </View>
        )}
        label={'Chatbot'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/chatbot' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#000')},   
        ]}
        style={{backgroundColor: pathname == '/chatbot' ? '#0072B2' : (colorScheme === 'dark' ? '#171717' : '#F9F9F9')}}
        onPress={() => {
          router.push('/(drawer)/chatbot')
        }}
      />

      {/* RESULTS DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <View
          className='w-30 h-30 p-1 rounded justify-items-center align-middle bg-teal-500'>
            <Feather name="bar-chart-2" size={24} color='#fff'/>
          </View>
        )}
        label={'Results'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/result' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#000')},   
        ]}
        style={{backgroundColor: pathname == '/result' ? '#0072B2' : (colorScheme === 'dark' ? '#171717' : '#F9F9F9')}}
        onPress={() => {
          router.push('/(drawer)/result')
        }}
      />

      {/* PROFILE DRAWER ITEM */}
      <DrawerItem
        icon={({color, size}) => (
          <View
          className='w-30 h-30 p-1 rounded justify-items-center align-middle bg-amber-500'>
            <Feather name="user" size={24} color='#fff'/>
          </View>
        )}
        label={'Profile'}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/profile' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#000')},   
        ]}
        style={{backgroundColor: pathname == '/profile' ? '#0072B2' : (colorScheme === 'dark' ? '#171717' : '#F9F9F9')}}
        onPress={() => {
          router.push('/(drawer)/profile')
        }}
      />

      {/* LOGOUT DRAWER ITEM */}
      <View className='flex-1 justify-end'>
        <DrawerItem
          icon={({color, size}) => (
            <MaterialCommunityIcons name="logout" size={24} color={ '#d55e00'}/>
          )}
          label={'Logout'}
          labelStyle={[
            styles.navItemLabel,
            { color: '#d55e00' },   
          ]}
          style={{backgroundColor: (colorScheme === 'dark' ? '#171717' : '#F9F9F9')}}
          onPress={() => {
            logout();
          }}
        />
      </View>
  </DrawerContentScrollView>
  )
}

const DrawerLayout = () => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Drawer 
        drawerContent={(props) => <CustomDrawerContent children={undefined} {...props}/>}
        screenOptions={{
          headerTitleAlign: 'center',
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#333',
          headerStyle: colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight,
          drawerStyle: colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight
        }}
      >
        <Drawer.Screen name="chatbot" options={{headerShown: true, headerTitle: "Chatbot"}} />
        <Drawer.Screen name="result" options={{headerShown: true, headerTitle: "Results"}} />
        <Drawer.Screen name="profile" options={{headerShown: true, headerTitle: "Profile"}} />
      </Drawer>
      
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  )
}

const styles = StyleSheet.create({
  navItemLabel: {marginLeft: -8, fontSize: 16},
  drawerDark: {
    backgroundColor: '#171717', // Dark background color
  },
  drawerLight: {
    backgroundColor: '#F9F9F9', // Light background color
  },
})

export default DrawerLayout