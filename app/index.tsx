import { StatusBar } from "expo-status-bar";
import React from 'react'
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, Pressable } from "react-native";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";

const Welcome = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Welcome to{"\n"}
              <Text className="text-tertiary">AphasiaChatter</Text>{" "}
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-black mt-7 text-center">
            Let's get started on your journey to improved communication!
          </Text>

          {/* Continue to login page */}
          <CustomButton
            title="Continue"
            handlePress={() => router.push("/login")}
            containerStyles={[{ width: '100%' }, { marginTop: 14 }]}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default Welcome;
