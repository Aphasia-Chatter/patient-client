import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { View, SafeAreaView, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useColorScheme } from 'nativewind';

import ErrorModal from "../../components/ErrorModal";
import DialogModal from "../../components/DialogModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

import { useAuthContext } from '../../context/AuthContext';
import { fetchValue, deleteValue } from "../../utils/SecureStore";

const delete_password = () => {
    const { appUser, setAppUser } = useAuthContext();
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorHeaderMessage, setErrorHeaderMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [dialogModalVisible, setDialogModalVisible] = useState(false);
    const [dialogHeaderMessage, setDialogHeaderMessage] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
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
        submit();
    };
    const handleDialogModalDismiss = () => {
        setDialogModalVisible(false);
    };

    const { colorScheme } = useColorScheme();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        password: "",
    });

    const submit = async () => {
        setSubmitting(true);

        try {
            // Send POST request for patient login
            // Use ipconfig to find ip address of your pc in the local network
            const response = await fetch('http://10.0.2.2:44818/api/patient/change_password', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: form.password,
                }),
            });

            const jsonResponse = await response.json();

            if (response.ok) {
                // Delete username and session token from local storage in device
                setAppUser(null)
                await deleteValue("AppUser")

                // Redirect to login page
                router.replace("/(auth)/login");

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
      <ScrollView>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>All personal information will be deleted.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>All chat messages and its history will be destroyed.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="closecircle" size={16} color={colorScheme === "dark" ? "#ffd966" : "#e69138"} style={{ marginRight: 8 }} />
                <Text className='text-base text-black dark:text-white'>All results and its history will be destroyed.</Text>
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
      </ScrollView>

      {/* Delete Account */}
      <View className="p-4 absolute bottom-0 left-0 right-0">
        <CustomButton
          title="Delete Account Permanently"
          handlePress={handleDialogModalOpen}
          backgroundColor="#0072B2"
          containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
          isLoading={isSubmitting}
        />
      </View>
      
    </SafeAreaView>
  </KeyboardAvoidingView>
  )
}

export default delete_password