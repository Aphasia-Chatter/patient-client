import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import { useColorScheme } from 'nativewind';

const AuthLayout = () => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default AuthLayout;