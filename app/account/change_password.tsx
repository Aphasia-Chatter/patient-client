import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { View, SafeAreaView, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useColorScheme } from 'nativewind';

import ErrorModal from "../../components/ErrorModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const change_password = () => {
  const { colorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const submit = async () => {
    setSubmitting(true);

    try {
      // Send POST request for patient login
      // Use ipconfig to find ip address of your pc in the local network
      const response = await fetch('http://xxx.xxx.x.xx:44818/api/patient/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
            confirmNewPassword: form.confirmNewPassword,
        }),
      });

      const jsonResponse = await response.json();

      if (response.ok) {
        // Handle successful registration
        router.replace("/(drawer)/profile");
      } else {
        router.replace("/(drawer)/profile");

        // Handle errors
        // console.error("HTTP status ${response.status}");
        // console.error(jsonResponse.message);
        // setModalVisible(true);
      }
    } catch (error) { // Error such as Network request failed
      router.replace("/(drawer)/profile");
      // console.error('Error:', error);
      
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
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="w-full justify-center px-4"
              // style={{
              //   minHeight: Dimensions.get("window").height - 100,
              // }}
          >
            <ErrorModal 
              headerMessage="Update Password "
              errorMessage="Incorrect old password, new password or confirm password! Please try again."
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />

            {/* Password Requirements */}
            <View className='mt-7 p-4 items-start  rounded-lg bg-light-MID dark:bg-dark-MID'>
              <Text className='mb-2 text-base font-bold text-black dark:text-white'>
                Password must fulfil the following.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>An uppercase character</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>An lowercase character</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>An number</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>An special character</Text>
              </View>
            </View>

            <FormField
              title="Current Password"
              value={form.oldPassword}
              handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
              placeholder="Enter your current password"
              otherStyles="mt-7"
              keyboardType="default"
            />

            <FormField
              title="New Password"
              value={form.newPassword}
              handleChangeText={(e) => setForm({ ...form, newPassword: e })}
              placeholder="Enter your new password"
              otherStyles="mt-4"
            />

            <FormField
              title="Confirm New Password"
              value={form.confirmNewPassword}
              handleChangeText={(e) => setForm({ ...form, confirmNewPassword: e })}
              placeholder="Enter your confirm password"
              otherStyles="mt-4"
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* Update Password */}
      <View className="p-4 absolute bottom-0 left-0 right-0">
        <CustomButton
          title="Update Password"
          handlePress={submit}
          backgroundColor="#0072B2"
          containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
          isLoading={isSubmitting}
        />
      </View>

    </SafeAreaView>
  </KeyboardAvoidingView>
  )
}

export default change_password