import { router } from "expo-router";
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, Pressable } from "react-native";

import { icons } from "../../constants";

const settings = () => {
  const logout = async () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView className="bg-white h-full">
    </SafeAreaView>
  )
}

export default settings