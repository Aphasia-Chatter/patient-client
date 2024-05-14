import { useState } from "react";
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

import { images } from "../../constants";

const home = () => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView className="bg-primary">
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row">
          <View>
          <Text className="font-bold text-2xl text-black">
              Welcome back,
            </Text>
            <Text className="font-bold text-2xl text-tertiary">
              John Doe
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <View className="mt-1.5 mr-1.5">
            <Image
              source={images.logoSmall}
              className="w-9 h-10"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default home