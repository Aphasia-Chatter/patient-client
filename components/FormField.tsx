import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps, Pressable, TouchableWithoutFeedback, Keyboard} from "react-native";
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
  const [ showPassword, setShowPassword ] = useState(false);
  
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="pb-1 text-base font-normal text-dark dark:text-light">{title}</Text>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full h-18 px-4 py-5 text-gray-100 rounded-xl border-2 border-light-MID dark:border-dark-MID bg-light-MID dark:bg-dark-MID focus:border-secondary flex flex-row items-center">
          <TextInput
            autoCorrect={false}
            textContentType={'oneTimeCode'}
            autoCapitalize="none"
            autoComplete='off'
            className="flex-1 font-psemibold text-base text-dark dark:text-light bg-light-MID dark:bg-dark-MID"
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#525252'}
            onChangeText={handleChangeText}
            secureTextEntry={(title === "Password" || title === "Confirm Password" || title === "Current Password" || title === "New Password" || title === "Confirm New Password") && !showPassword}
            {...props}
          />

          {(title === "Password" || title === "Confirm Password" || title === "Current Password" || title === "New Password" || title === "Confirm New Password") && (
            <Pressable
              style={({ pressed }) => [,
                pressed ? { opacity: 0.5 } : {},
              ]} 
              onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome5
                  name={showPassword === true ? "eye" : "eye-slash"}
                  size={24}
                  color={colorScheme === 'dark'  ? '#fff' : '#525252'}
                />
            </Pressable>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default FormField;