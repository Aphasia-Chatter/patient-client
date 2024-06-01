import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs, router } from "expo-router";
import { useColorScheme } from 'nativewind';

const AccountLayout = () => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="change_password"
          options={{
            headerShown: true,
          }}
        />
      </Tabs>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default AccountLayout;