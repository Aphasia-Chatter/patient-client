import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import { router } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { View, SafeAreaView, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useColorScheme } from 'nativewind';

import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import DialogModal from "../../components/DialogModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

import { useAuthContext } from '../../context/AuthContext';
import { saveValue } from "../../utils/SecureStore";

const change_password = () => {
  const { appUser, setAppUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);
  const [ sessionToken ] = useState(appUser?.sessionToken);
  
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorHeaderMessage, setErrorHeaderMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successHeaderMessage, setSuccessHeaderMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [dialogModalVisible, setDialogModalVisible] = useState(false);
  const [dialogHeaderMessage, setDialogHeaderMessage] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSuccessModalDismiss = () => {
    setSuccessModalVisible(false);

    // Add a small delay to allow modal to finish dismissing
    setTimeout(() => {
      router.replace("/(auth)/login");
    }, 100);
  };

  const handleDialogModalOpen = () => {
    if (form.currentPassword.length > 0 && form.newPassword.length > 0 && form.confirmNewPassword.length > 0) {
      setDialogHeaderMessage("Change Account Password")
      setDialogMessage("Are you sure you want to update your account password?")
      setDialogModalVisible(true);
    }
    else {
      setErrorHeaderMessage("MISSING_PASSWORD")
      setErrorMessage("Passwords are missing in the request body field.")
      setErrorModalVisible(true);
    }
  };

  const handleDialogModalConfirm = () => {
    setDialogModalVisible(false);
    submitAccountUpdatePasswordRequest();
  };

  const handleDialogModalDismiss = () => {
      setDialogModalVisible(false);
  };

  const { colorScheme } = useColorScheme();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const submitAccountUpdatePasswordRequest = async () => {
    setSubmitting(true);

    if (form.currentPassword.length == 0) {
      setErrorHeaderMessage("MISSING_PASSWORD")
      setErrorMessage("Please enter your current password.")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else if (form.newPassword.length == 0) {
      setErrorHeaderMessage("MISSING_NEW_PASSWORD")
      setErrorMessage("Please enter your new password.")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else if (form.confirmNewPassword.length == 0) {
      setErrorHeaderMessage("MISSING_CONFIRM_NEW_PASSWORD")
      setErrorMessage("Please re-confirm your new password.")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else {
      try {
        // Send POST request for patient login
        // Use ipconfig to find ip address of your pc in the local network
        const response = await fetch('http://192.168.50.248:44818/api/patient/change-account-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: username,
              sessionToken: sessionToken,
              currentPassword: form.currentPassword,
              newPassword: form.newPassword,
              confirmNewPassword: form.confirmNewPassword,
          }),
        });

        const jsonResponse = await response.json();

        if (response.ok) {
          // Delete username and session token from local storage in device
          setAppUser(null);
          await saveValue("AppUser", null);

          // Show success modal
          setSuccessHeaderMessage(jsonResponse.status);
          setSuccessMessage(jsonResponse.message);
          setSuccessModalVisible(true);
        } else {
          // Show error message
          setErrorHeaderMessage(jsonResponse.status);
          setErrorMessage(jsonResponse.message);
          setErrorModalVisible(true);
        }
      } catch (error) {
        console.error('Error:', error);
        if (error instanceof TypeError) { // Error such as Network request failed
          setErrorHeaderMessage("NETWORK_REQUEST_TIMED_OUT")
          setErrorMessage("There was a problem with the network request.")
          setErrorModalVisible(true);
        }
        console.error('Error:', error);
        
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light dark:bg-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
    <SafeAreaView className="h-full bg-light dark:bg-dark">
      <ScrollView showsHorizontalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="w-full justify-center px-4"
              // style={{
              //   minHeight: Dimensions.get("window").height - 100,
              // }}
          >
            <ErrorModal 
              headerMessage={errorHeaderMessage}
              errorMessage={errorMessage}
              modalVisible={errorModalVisible}
              setModalVisible={setErrorModalVisible}
            />

            <SuccessModal 
              headerMessage={successHeaderMessage}
              successMessage={successMessage}
              modalVisible={successModalVisible}
              onDismiss={handleSuccessModalDismiss}
            />

            <DialogModal 
              headerMessage={dialogHeaderMessage}
              dialogMessage={dialogMessage}
              modalVisible={dialogModalVisible}
              setModalVisible={setDialogModalVisible}
              onConfirm={handleDialogModalConfirm}
              onDismiss={handleDialogModalDismiss}
            />

            {/* Password Requirements */}
            <View className='mt-7 p-4 items-start  rounded-lg bg-light-MID dark:bg-dark-MID'>
              <Text className='mb-2 text-base font-bold text-black dark:text-white'>
              Password must contain at least three of the following:
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>A uppercase character</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>A lowercase character</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>A digit</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>A special character</Text>
              </View>
            </View>

            <FormField
              title="Current Password"
              value={form.currentPassword}
              handleChangeText={(e) => setForm({ ...form, currentPassword: e })}
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

        {/* Update Password */}
        <View className={`p-4 ${Platform.OS === 'ios' ? 'pb-10' : 'pb-5'} `}>
          <CustomButton
            title="Update Password"
            handlePress={handleDialogModalOpen}
            backgroundColor="#0072B2"
            containerStyles={[{ width: '100%' }]}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  </KeyboardAvoidingView>
  )
}

export default change_password