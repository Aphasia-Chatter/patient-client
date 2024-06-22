import React, { useState } from "react";
import { Link, router } from "expo-router";
import { View, SafeAreaView, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const register = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorHeaderMessage, setErrorHeaderMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successHeaderMessage, setSuccessHeaderMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSuccessModalDismiss = () => {
    // Redirect to home page
    setSuccessModalVisible(false);
    router.replace("/login");
  };

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    enrolmentCode: "",
  });

  const submit = async () => {
    setSubmitting(true);

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
    }
    else if (form.confirmPassword.length == 0) {
      setErrorHeaderMessage("MISSING_PASSWORD")
      setErrorMessage("Please re-confirm your password.")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else if (form.enrolmentCode.length == 0){
      setErrorHeaderMessage("MISSING_ENROLMENT")
      setErrorMessage("Please enter the enrolment code given.")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else {
      try {
        // Send POST request for patient registration
        // Use ipconfig to find ip address of your pc in the local network
        const response = await fetch('http://192.168.1.97:44818/api/patient/register', {
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
          // Handle successful login
          setSuccessHeaderMessage(jsonResponse.status)
          setSuccessMessage(jsonResponse.message)
          setSuccessModalVisible(true);
        } else {
          // Handle errors
          setErrorHeaderMessage(jsonResponse.status)
          setErrorMessage(jsonResponse.message)
          setErrorModalVisible(true);
        }
      } catch (error) {
        console.error('Error:', error);
        if (error instanceof TypeError) { // Error such as Network request failed
          setErrorHeaderMessage("NETWORK_REQUEST_TIMED_OUT")
          setErrorMessage("There was a problem with the network request.")
          setErrorModalVisible(true);
        }
        setSubmitting(false);
        
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light dark:bg-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -25 : 0}
    >
      <SafeAreaView className="h-full bg-light dark:bg-dark">
        <ScrollView className={`${Platform.OS === 'ios' ? 'py-8' : 'py-28'}`}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full h-full px-4"
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

              <View className="justify-items-center w-full">
                <Text className="text-3xl font-bold text-center text-dark dark:text-light">
                  Register for an{"\n"}
                  <Text className="text-primary">Account</Text>{" "}
                </Text>
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
                containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
                isLoading={isSubmitting}
              />

              {/* Redirect to Login Page*/}
              <View className="flex-row justify-center mt-8">
                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-semibold text-dark dark:text-light`}>Have an account already? </Text>
                <Link className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-semibold text-orange-400 dark:text-yellow-500`} href="/login">Login here</Link>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default register