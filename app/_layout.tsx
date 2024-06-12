import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeWindStyleSheet, useColorScheme } from "nativewind";

import { AppProvider } from "../context/AppContext"
import { AuthProvider } from "../context/AuthContext"
import { fetchValue } from '../utils/SecureStore';

NativeWindStyleSheet.setOutput({
  default: "native",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [ isWelcome, setIsWelcome ] = useState<boolean>(false);
  const [ appUser, setAppUser ] = useState(null);

  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMonoBold: require('../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoBoldItalic: require('../assets/fonts/SpaceMono-Bold.ttf'),
    SpaceMonoItalic: require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  const prepareApp = async () => {
    try {
        const storedWelcome = await fetchValue("isWelcome")
        const storedAppUser = await fetchValue("AppUser")
        
        if (storedWelcome && storedAppUser) {
            setIsWelcome(storedWelcome)
            setAppUser(storedAppUser)
        }

    } catch ( error ) {
        throw error;
    } finally {
      setTimeout(() => SplashScreen.hideAsync(), 1000)

      if (isWelcome) {
        if (appUser) {
          router.replace("/(drawer)/chatbot");
        } else {
          router.replace("/(auth)/login");
        }
      }
    }
  }

  useEffect(() => {
    if (loaded) {
      prepareApp();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
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

          <Stack.Screen
            name="account/delete_account"
            options={{
              headerShown: true,
              headerTintColor: colorScheme === 'dark' ? '#fff' : '#333',
              headerStyle: colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight,
              headerTitle: "Delete Account"
          }}/>
        </Stack>  
      
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </AuthProvider>
    </AppProvider>
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