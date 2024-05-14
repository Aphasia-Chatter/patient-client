import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
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

      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  );
};

export default AuthLayout;