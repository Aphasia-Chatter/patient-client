import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const register = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    enrollmentCode: "",
  });

  const submit = async () => {
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
    style={{ flex: 1 }}
    >
      <SafeAreaView className="bg-white h-full">
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className="w-full flex justify-center items-center h-full px-4 my-4"
              // style={{
              //   minHeight: Dimensions.get("window").height - 100,
              // }}
            >
              <View className="relative">
                <Text className="text-3xl text-black font-bold text-center">
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
                value={form.enrollmentCode}
                handleChangeText={(e) => setForm({ ...form, enrollmentCode: e })}
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
              <View className="flex-row justify-center mt-4">
                <Text className="text-black font-semibold">Have an account already?</Text>
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