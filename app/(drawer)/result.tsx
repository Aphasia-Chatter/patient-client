import { useState } from "react";
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

import { images } from "../../constants";

const result = () => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView className="bg-white">
    </SafeAreaView>
  )
}

export default result