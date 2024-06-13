import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { View, SafeAreaView, Text, Image, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { images } from "../../constants";
import ErrorModal from "../../components/ErrorModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useAuthContext } from '../../context/AuthContext';
import { saveValue, fetchValue } from "../../utils/SecureStore";

const login = () => {
  const { setAppUser } = useAuthContext();

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorHeaderMessage, setErrorHeaderMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    setSubmitting(true);

    try {
      // Send POST request for patient login
      // Use ipconfig to find ip address of your pc/emulator in the local network
      const response = await fetch('http://10.0.2.2:44818/api/patient/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const jsonResponse = await response.json();

      if (response.ok) {
        // Save username and session token into local storage in device
        setAppUser(jsonResponse.data)
        await saveValue("AppUser", jsonResponse.data)

        // Handle successful login
        router.replace("/(drawer)/chatbot");

      } else {
        // Handle errors
        setErrorHeaderMessage(jsonResponse.status)
        setErrorMessage(jsonResponse.message)
        setErrorModalVisible(true);
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
    <SafeAreaView className="h-full bg-light dark:bg-dark">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full h-full flex justify-center items-center px-4"
            // style={{
            //   minHeight: Dimensions.get("window").height - 100,
            // }}
        >
          {/* Preference Logo */}
          <View className={`w-30 h-30 absolute top-0 right-0 ${Platform.OS === 'ios' ? 'mt-4' : 'mt-16'} mr-8 p-1 rounded-full justify-center items-center bg-neutral-300 dark:bg-neutral-700`}>
            <Pressable onPress={() => router.push("/preference")}>
              <Feather name="settings" size={24} color={'#F9F9F9'}/>
            </Pressable>
          </View>

          <ErrorModal 
            headerMessage={errorHeaderMessage}
            errorMessage={errorMessage}
            modalVisible={errorModalVisible}
            setModalVisible={setErrorModalVisible}
          />

          <Image
            source={images.logoSmall}
            className="w-[96px] h-[96px] mb-6"
            resizeMode="contain"
          />

          <View className="relative">
            <Text className="text-3xl font-bold text-center text-dark dark:text-light">
              Log in with your{"\n"}
              <Text className="text-primary">Account</Text>{" "}
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-3 -right-0"
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
            title="Login"
            handlePress={submit}
            backgroundColor="#0072B2"
            containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
            isLoading={isSubmitting}
          />

          {/* Redirect to Register Page */}
          <View className="flex-row justify-center mt-8">
            <Text className="font-semibold text-dark dark:text-light">Don't have an account?</Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text className="font-semibold text-orange-400 dark:text-yellow-500"> Register here</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  </KeyboardAvoidingView>
  )
}

export default login