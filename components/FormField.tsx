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
      <Text className="text-base font-pmedium text-dark dark:text-light">{title}</Text>

      <View className="w-full h-16 px-4 py-4 text-gray-100 rounded-xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 font-psemibold text-base "
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" || title === "Confirm Password" && !showPassword}
          autoCorrect={false}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome5
              name={!showPassword ? "eye" : "eye-slash"}
              size={24}
              color={colorScheme ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        )}

        {title === "Confirm Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome5
              name={!showPassword ? "eye" : "eye-slash"}
              size={24}
              color={colorScheme ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;