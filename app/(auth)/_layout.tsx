import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { StyleSheet } from 'react-native';
import { useColorScheme } from 'nativewind';

// headerTitle of the previous page is shown beside the back button on iOS devices,
// together with headerTitle of current page.
// Only headerTitle of the current page is shown on Android devices

const AuthLayout = () => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerTitle: "Login",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerTitle: "Register",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="preference"
          options={{
            headerTitle: "Preference",
            headerShown: true,
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#333',
            headerStyle: colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight,
          }}/>

      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  navItemLabel: {marginLeft: -8, fontSize: 16},
  drawerDark: {
    backgroundColor: '#171717', // Dark background color
  },
  drawerLight: {
    backgroundColor: '#F9F9F9', // Light background color
  },
})