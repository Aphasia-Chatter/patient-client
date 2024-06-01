import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { images } from "../../constants";
import ErrorModal from "../../components/ErrorModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const register = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    enrolmentCode: "",
  });

  const submit = async () => {
    setSubmitting(true);

    try {
      // Send POST request for patient registration
      // Use ipconfig to find ip address of your pc in the local network
      const response = await fetch('http://xxx.xxx.x.xx:44818/api/patient/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          confirmPassword: form.confirmPassword,
          enrolmentCode: form.enrolmentCode,
        }),
      });

      const jsonResponse = await response.json();

      if (response.ok) {
        // Handle successful registration
        router.replace("/login");
      } else {
        // Handle errors
        console.error("HTTP status ${response.status}");
        console.error(jsonResponse.message);
        setModalVisible(true);
      }
    } catch (error) { // Error such as Network request failed
      console.error('Error:', error);
      
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light dark:bg-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView className="h-full bg-light dark:bg-dark">
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className="w-full flex justify-center items-center h-full px-4 my-4"
              // style={{
              //   minHeight: Dimensions.get("window").height - 100,
              // }}
            >
              <ErrorModal 
                headerMessage="Register "
                errorMessage="Username already exist. Try again."
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />

              <View className="relative">
                <Text className="text-3xl font-bold text-center text-dark dark:text-light">
                  Register for an{"\n"}
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
                otherStyles="mt-10"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                placeholder="Enter your password"
                otherStyles="mt-7"
              />

              <FormField
                title="Confirm Password"
                value={form.confirmPassword}
                handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                placeholder="Re-enter your password"
                otherStyles="mt-7"
              />

              <FormField
                title="Enrollment Code"
                value={form.enrolmentCode}
                handleChangeText={(e) => setForm({ ...form, enrolmentCode: e })}
                placeholder="Enter the enrollment code"
                otherStyles="mt-7"
                keyboardType="default"
              />

              {/* Register */}
              <CustomButton
                title="Register"
                handlePress={submit}
                backgroundColor="#0072B2"
                containerStyles={[{ width: '100%' }, { marginTop: 14 }]}
                isLoading={isSubmitting}
              />

              {/* Redirect to Login Page*/}
              <View className="flex-row justify-center mt-8">
                <Text className="font-semibold text-dark dark:text-light">Have an account already?</Text>
                <Pressable onPress={() => router.push("/login")}>
                  <Text className="font-semibold text-secondary"> Login here</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default register