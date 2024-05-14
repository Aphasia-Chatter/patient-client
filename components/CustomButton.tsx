import React from 'react';
import { ActivityIndicator, Text, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, handlePress, containerStyles, textStyles, isLoading, ...props }) => {
  return (
    <Pressable
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: 'green', // Example background color
          borderRadius: 10, // Example border radius
          minHeight: 62, // Example minimum height
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerStyles,
        isLoading && { opacity: 0.5 }, // Apply opacity if loading
      ]}
      disabled={isLoading}
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
        />
      )}
    </Pressable>
  );
}; 

export default CustomButton;
