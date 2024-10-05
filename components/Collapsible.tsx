import { Feather } from '@expo/vector-icons';
import { PropsWithChildren, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [ isOpen, setIsOpen ] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <View className={`p-4 ${isOpen && 'border-b-2 border-b-gray-100 dark:border-b-gray-500 bg-gray-200 dark:bg-gray-600'}`}>
      {/* Button that toggles the collapsible content */}
      <TouchableOpacity 
        className='flex-row items-center'
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Text className={`flex-1 ml-2 mr-3 text-sm ${isOpen ? ' font-bold text-gray-950 dark:text-gray-50' : 'text-dark dark:text-light'}`}>
          {title}
        </Text>
        <Feather
          name={isOpen ? 'minus' : 'plus'}
          size={24}
          color={isOpen ? (colorScheme === 'dark' ? '#D1D5DB' : '#1f2937') : (colorScheme === 'dark' ? '#fff' : '#333')}
        />
      </TouchableOpacity>
      
      {/* Collapsible content that shows only when isOpen is true */}
      {isOpen && (
        <View className='mt-4 mb-5 mx-2'>
          {children}
        </View>
      )}
    </View>
  );
}
