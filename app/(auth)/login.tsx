import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const login = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    router.replace("/chatbot");
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={{ flex: 1, backgroundColor: 'white' }}
    >
    <SafeAreaView className="bg-white h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            className="w-full flex justify-center items-center h-full px-4 my-4"
              // style={{
              //   minHeight: Dimensions.get("window").height - 100,
              // }}
          >
            <Image
              source={images.logo}
              className="w-[260px] h-[168px]"
              resizeMode="contain"
            />

            <View className="relative">
              <Text className="text-3xl text-black font-bold text-center">
                Log in with your{"\n"}
                <Text className="text-primary">Account</Text>{" "}
              </Text>

              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              placeholder="Enter your username"
              otherStyles="mt-7"
              keyboardType="default"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Enter your password"
              otherStyles="mt-4"
            />

            {/* Login */}
            <CustomButton
              title="Sign In"
              handlePress={submit}
              backgroundColor="#0072B2"
              containerStyles={[{ width: '100%' }, { marginTop: 14 }]}
              isLoading={isSubmitting}
            />

            {/* Redirect to Register Page */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-black font-semibold">Don't have an account?</Text>
              <Pressable onPress={() => router.push("/register")}>
                <Text className="font-semibold text-secondary"> Register here</Text>
              </Pressable>
            </View>
          </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  </KeyboardAvoidingView>
  )
}

export default login