import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, TextInputProps } from "react-native";
import { useColorScheme } from 'nativewind';
import { FontAwesome5 } from '@expo/vector-icons';

interface FormFieldProps extends TextInputProps {
    title: string;
    value: string;
    placeholder: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
  }

const FormField: React.FC<FormFieldProps> = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-normal text-dark dark:text-light">{title}</Text>

      <View className="w-full h-16 px-4 py-4 text-gray-100 rounded-xl border-2 border-light-MID dark:border-dark-MID bg-light-MID dark:bg-dark-MID focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 font-psemibold text-base text-dark dark:text-light bg-light-MID dark:bg-dark-MID"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#525252'}
          onChangeText={handleChangeText}
          secureTextEntry={(title === "Password" || title === "Confirm Password") && !showPassword}
          autoCorrect={false}
          {...props}
        />

        {(title === "Password" || title === "Confirm Password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome5
              name={showPassword === true ? "eye" : "eye-slash"}
              size={24}
              color={colorScheme === 'dark'  ? '#fff' : '#525252'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;