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

const deleteAccount = () => {
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
    if (form.password.length > 0) {
      setDialogHeaderMessage("Delete Account")
      setDialogMessage("Are you sure you want to delete this account? The action cannot be reverted.")
      setDialogModalVisible(true);
    }
    else {
      setErrorHeaderMessage("MISSING_PASSWORD")
      setErrorMessage("password is missing in the request body field.")
      setErrorModalVisible(true);
    }
  };

  const handleDialogModalConfirm = () => {
      setDialogModalVisible(false);
      submitAccountDeletionRequest();
  };
  
  const handleDialogModalDismiss = () => {
      setDialogModalVisible(false);
  };

  const { colorScheme } = useColorScheme();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
      password: "",
  });

  const submitAccountDeletionRequest = async () => {
    const controller = new AbortController();
    const timeout = 5000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    setSubmitting(true);

    if (form.password.length == 0) {
      setErrorHeaderMessage("MISSING_PASSWORD")
      setErrorMessage("Please enter your password.")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else{
      try {
          // Send POST request for patient login
          // Use ipconfig to find ip address of your pc in the local network
          const response = await fetch('http://192.168.50.248:44818/api/patient/delete-account', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username: username,
                  sessionToken: sessionToken,
                  password: form.password,
              }),
              signal: signal
          });

          // Clear the timeout if the request is successful
          clearTimeout(timeoutId);

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
            // Handle errors
            setErrorHeaderMessage(jsonResponse.status)
            setErrorMessage(jsonResponse.message)
            setErrorModalVisible(true);
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

            {/* Delete Account Notice */}
            <View className='mt-7 p-4 items-start  rounded-lg bg-light-MID dark:bg-dark-MID'>
              <Text className='mb-2 text-base font-bold text-black dark:text-white'>
                Warning: This action cannot be undone.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink:1 }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>All personal information will be deleted.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink:1 }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>All chat messages and its history will be destroyed.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink:1 }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base flex-shrink text-black dark:text-white'>All results and its history will be destroyed.</Text>
              </View>
            </View>

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Enter your password"
              otherStyles="mt-7"
              keyboardType="default"
            />
          </View>
        </TouchableWithoutFeedback>

        {/* Delete Account */}
        <View className={`p-4 ${Platform.OS === 'ios' ? 'pb-10' : 'pb-5'}`}>
          <CustomButton
            title="Delete Account Permanently"
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

export default deleteAccount