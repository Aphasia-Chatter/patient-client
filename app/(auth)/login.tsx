import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { View, SafeAreaView, Text, Image, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { images } from "../../constants";
import ErrorModal from "../../components/ErrorModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useAuthContext } from '../../context/AuthContext';
import { saveValue } from "../../utils/SecureStore";

const Login = () => {
  const { setAppUser } = useAuthContext();

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorHeaderMessage, setErrorHeaderMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    const controller = new AbortController();
    const timeout = 10000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    setSubmitting(true);

    try {
      if (form.username.length == 0) {
        setErrorHeaderMessage("MISSING_USERNAME")
        setErrorMessage("Please enter your username.")
        setErrorModalVisible(true);
        setSubmitting(false);
      }
      else if (form.password.length == 0) {
        setErrorHeaderMessage("MISSING_PASSWORD")
        setErrorMessage("Please enter your password.")
        setErrorModalVisible(true);
        setSubmitting(false);
      } else {
        // Send POST request for patient login
        // Use ipconfig to find ip address of your pc/emulator in the local network
        const response = await fetch('https://aphasia.mooo.com/api/patient/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
          signal: signal
        });

        // Clear the timeout if the request is successful
        clearTimeout(timeoutId);

        const jsonResponse = await response.json();

        if (response.ok) {
          // Save username and session token into local storage in device
          setAppUser(jsonResponse.data)
          await saveValue("AppUser", jsonResponse.data)

          // Handle successful login
          router.replace("/(drawer)/tasks");

        } else {
          // Handle errors
          setErrorHeaderMessage(jsonResponse.status)
          setErrorMessage(jsonResponse.message)
          setErrorModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (signal.aborted) {
        setErrorHeaderMessage("NETWORK REQUEST TIMED_OUT")
        setErrorMessage("The request has been aborted due to timeout.")
        setErrorModalVisible(true);
      }
      else if (error instanceof TypeError) { // Error such as Network request failed
        setErrorHeaderMessage("NETWORK REQUEST ERROR")
        setErrorMessage("There was a problem with the network request.")
        setErrorModalVisible(true);
      }    
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
          {/* Preference Logo (Only render when not focused) */}
          {!isFocused && (
            <View className={`w-30 h-30 absolute top-0 right-0 ${Platform.OS === 'ios' ? 'mt-4' : 'mt-16'} mr-8 p-1 rounded-full justify-center items-center bg-neutral-300 dark:bg-neutral-700`}>
              <Pressable
                style={({ pressed }) => [,
                  pressed ? { opacity: 0.5 } : {},
                ]} 
                onPress={() => router.push("/preference")}
                accessibilityRole="button"
                accessibilityLabel="preference">
                <Feather name="settings" size={24} color={'#F9F9F9'}/>
              </Pressable>
            </View>
          )}

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
          </View>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            placeholder="Enter your username"
            otherStyles="mt-7"
            onFocus={() => setIsFocused(true)}   // Set focus to true on focus
            onBlur={() => setIsFocused(false)}   // Set focus to false on blur
            keyboardType="default"
            accessibilityRole="search"
            accessibilityLabel="username"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter your password"
            otherStyles="mt-4"
            onFocus={() => setIsFocused(true)}   // Set focus to true on focus
            onBlur={() => setIsFocused(false)}   // Set focus to false on blur
            accessibilityRole="search"
            accessibilityLabel="password"
          />

          {/* Login */}
          <CustomButton
            title="Login"
            handlePress={submit}
            backgroundColor="#0072B2"
            containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
            isLoading={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="login"
          />

          {/* Redirect to Register Page */}
          <View className="flex-row justify-center mt-8">
            <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-semibold text-dark dark:text-light`}>Don't have an account? </Text>
            <Link className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-semibold text-orange-400 dark:text-yellow-500`} href="/register" >Register here</Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  </KeyboardAvoidingView>
  )
}

export default Login