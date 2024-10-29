import React, { useState } from "react";
import { View, SafeAreaView, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Link, router } from "expo-router";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const Register = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorHeaderMessage, setErrorHeaderMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successHeaderMessage, setSuccessHeaderMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSuccessModalDismiss = () => {
    setSuccessModalVisible(false);

    // Add a small delay to allow modal to finish dismissing
    setTimeout(() => {
      router.replace("/login");
    }, 100);
  };

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    enrolmentCode: "",
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
      }
      else if (form.confirmPassword.length == 0) {
        setErrorHeaderMessage("MISSING_PASSWORD")
        setErrorMessage("Please re-confirm your password.")
        setErrorModalVisible(true);
        setSubmitting(false);
      }
      else if (form.confirmPassword != form.password) {
        setErrorHeaderMessage("INCORRECT_PASSWORD")
        setErrorMessage("Please re-confirm your passwords.")
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
        // Send POST request for patient registration
        // Use ipconfig to find ip address of your pc in the local network
        const response = await fetch('https://aphasia.mooo.com/api/patient/register', {
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
          signal: signal
        });
  
        // Clear the timeout if the request is successful
        clearTimeout(timeoutId);

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
                otherStyles={`${Platform.OS === 'ios' ? 'mt-5' : 'mt-7'}`}
                accessibilityRole="search"
                accessibilityLabel="username"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                placeholder="Enter your password"
                otherStyles={`${Platform.OS === 'ios' ? 'mt-5' : 'mt-7'}`}
                accessibilityRole="search"
                accessibilityLabel="password"
              />

              <FormField
                title="Confirm Password"
                value={form.confirmPassword}
                handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                placeholder="Re-enter your password"
                otherStyles={`${Platform.OS === 'ios' ? 'mt-5' : 'mt-7'}`}
                accessibilityRole="search"
                accessibilityLabel="confirm password"
              />

              <FormField
                title="Enrollment Code"
                value={form.enrolmentCode}
                handleChangeText={(e) => setForm({ ...form, enrolmentCode: e })}
                placeholder="Enter the enrollment code"
                otherStyles={`${Platform.OS === 'ios' ? 'mt-5' : 'mt-7'}`}
                keyboardType="default"
                accessibilityRole="search"
                accessibilityLabel="enrollment code"
              />

              {/* Register */}
              <CustomButton
                title="Register"
                handlePress={submit}
                backgroundColor="#0072B2"
                containerStyles={[{ width: '100%' }, { marginTop: 18 }]}
                isLoading={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="register"
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

export default Register