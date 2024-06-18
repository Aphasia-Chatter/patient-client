import { StatusBar } from "expo-status-bar";
import React, { useEffect }from 'react'
import { router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { View, SafeAreaView, Text, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useColorScheme } from 'nativewind';

import { images, icons } from "../constants";
import CustomButton from "../components/CustomButton";
import { useAppContext } from "../context/AppContext"
import { useAuthContext } from "../context/AuthContext"
import { fetchValue, saveValue } from '../utils/SecureStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Welcome = () => {
  const { isWelcome, setIsWelcome } = useAppContext();
  const { appUser, setAppUser } = useAuthContext();
  const { colorScheme } = useColorScheme();
  
  const handleWelcome = () => {
    // First launched app
    saveValue("isWelcome", true)
    router.replace("/login")
  };

  const redirection = async () => {
    try {
        const storedWelcome = await fetchValue("isWelcome")
        const storedAppUser = await fetchValue("AppUser")
        
        if (storedWelcome) {
            setIsWelcome(storedWelcome)
        }

        if (storedAppUser) {
          setAppUser(storedAppUser)
        }
        
    } catch ( error ) {
        throw error;
    } finally {
      if (isWelcome) {
        if (appUser) {
          router.dismissAll();
          router.replace("/(drawer)/chatbot");
        } else {
          router.dismissAll();
          router.replace("/(auth)/login");
        }
      }
    }
  }

  useEffect(() => {
    redirection();
  }, []);

  return (
    <SafeAreaView className="h-full bg-light dark:bg-dark">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <View className="w-full flex justify-center items-center h-full px-4">
            <View className="relative mt-5 items-center">
              {/* Chatbot Icon */}
              <Image
                source={icons.chatbot}
                className="rounded-2xl mb-5"
                resizeMode="contain"
                style={{height: 128, width: 128}}
                />

              {/* Welcome To the App */}
              <Text className="text-3xl text font-bold text-center text-dark dark:text-light">
                Welcome to{"\n"}
                <Text className="text-primary">AphasiaChatter</Text>{" "}
              </Text>

              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-3 -right-11"
                resizeMode="contain"
              />
            </View>

            {/* Tagline */}
            <Text className="text-xl font-pregular mt-7 text-center text-dark dark:text-light">
              Let's get started on your journey to improve your communication!
            </Text>

            {/* Continue to login page */}
            <CustomButton
              title="Continue"
              handlePress={handleWelcome}
              backgroundColor="#0072B2" 
              containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
              isLoading={false}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Welcome;
