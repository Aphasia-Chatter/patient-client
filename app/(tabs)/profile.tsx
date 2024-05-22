import { router } from "expo-router";
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, Pressable } from "react-native";

import { icons } from "../../constants";

const profile = () => {
  const logout = async () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
        <Pressable
          onPress={logout}
          className="flex w-full items-end mb-10"
        >

          <View className="mt-1.5 mr-1.5">
            <Image
              source={icons.logout}
              className="w-9 h-10"
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default profile