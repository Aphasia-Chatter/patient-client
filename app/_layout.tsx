import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NativeWindStyleSheet, useColorScheme } from "nativewind";

import { AuthProvider } from "../context/AuthContext"

NativeWindStyleSheet.setOutput({
  default: "native",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMonoBold: require('../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoBoldItalic: require('../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoItalic: require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ 
            headerShown: false
        }}/>
        
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            headerTitle: "Back"
        }}/>

        <Stack.Screen
          name="preference"
          options={{
            headerShown: true,
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#333',
            headerStyle: colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight,
            headerTitle: "Preference"
        }}/>

        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            headerTitle: "Back"
        }}/>

        <Stack.Screen
          name="account/change_password"
          options={{
            headerShown: true,
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#333',
            headerStyle: colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight,
            headerTitle: "Change Password"
        }}/>
      </Stack>  
    
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </AuthProvider>

  );
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

export default RootLayout