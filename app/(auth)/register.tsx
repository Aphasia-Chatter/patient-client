import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, Pressable} from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const register = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center items-center h-full px-4 my-3"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >

          <View className="relative">
            <Text className="text-3xl text-black font-bold text-center">
              Register for an{"\n"}
              <Text className="text-tertiary">Account</Text>{" "}
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
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            placeholder="Enter your email"
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter your password"
            otherStyles="mt-7"
          />

          {/* Register */}
          <CustomButton
            title="Register"
            handlePress={submit}
            containerStyles={[{ width: '100%' }, { marginTop: 14 }]}
            isLoading={isSubmitting}
          />

          {/* Redirect to Login Page*/}
          <View className="flex-row justify-center mt-4">
            <Text className="text-black font-semibold">Have an account already?</Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="font-semibold text-tertiary"> Login here</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default register