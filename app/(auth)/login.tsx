import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const login = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
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
            className="w-full flex justify-center items-center h-full px-4 my-3"
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
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder="Enter your email"
              otherStyles="mt-7"
              keyboardType="email-address"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default login