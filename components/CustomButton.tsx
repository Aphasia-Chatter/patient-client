import React from 'react';
import { ActivityIndicator, Text, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  isLoading?: boolean;
  backgroundColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, handlePress, containerStyles, textStyles, isLoading, backgroundColor, ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [,
        pressed ? {
          opacity: 0.5,
          backgroundColor,
          borderRadius: 10,
          minHeight: 62,
          justifyContent: 'center',
          alignItems: 'center',
        } : {
          backgroundColor,
          borderRadius: 10,
          minHeight: 62,
          justifyContent: 'center',
          alignItems: 'center',
        }, containerStyles, isLoading && { opacity: 0.5}
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      testID="custom-button"
      {...props}
    >
      <Text
        style={[
          {
            color: 'white', // Example text color
            fontWeight: 'bold', // Example font weight
            fontSize: 18, // Example font size
          },
          textStyles,
        ]}
      >
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={{ marginLeft: 5 }} // Example margin left
          testID="loading-indicator"
        />
      )}
    </Pressable>
  );
}; 

export default CustomButton;
