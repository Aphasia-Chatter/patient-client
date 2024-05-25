import { StatusBar } from "expo-status-bar";
import React from 'react'
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { tailwind, getColor } from '../tailwind'; // Import the tailwind utility and getColor function
import { images } from "../constants";
import CustomButton from "../components/CustomButton";

const Welcome = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <View className="w-full flex justify-center items-center h-full px-4">
            <View className="relative mt-5">
              <Text className="text-3xl text-black font-bold text-center">
                Welcome to{"\n"}
                <Text className="text-primary">AphasiaChatter</Text>{" "}
              </Text>

              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>

            <Text className="text-sm font-pregular text-black mt-7 text-center">
              Let's get started on your journey to improve your communication!
            </Text>

            {/* Continue to login page */}
            <CustomButton
              title="Continue"
              handlePress={() => router.push("/login")}
              backgroundColor="#0072B2" 
              containerStyles={[{ width: '100%' }, { marginTop: 14 }]}
              isLoading={false}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default Welcome;
