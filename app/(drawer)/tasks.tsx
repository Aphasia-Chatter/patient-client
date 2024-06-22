import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { router } from "expo-router";
import { Image, Text, View, FlatList, ListRenderItem, StyleSheet, Platform, Pressable, Button, ScrollView} from "react-native";
import { FontAwesome5, FontAwesome6, Octicons, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { useAuthContext } from '../../context/AuthContext';

// Define types for tasks
type Task = {
  taskName: string;
  category: String;
  createdBy: string;
  status: string;
};

const dummyTasks: Task[] = [
  {
    taskName: "Identify the object shown.",
    category: "Word Retrieval",
    createdBy: 'Dr. ABC',
    status: 'Completed'
  },
  {
    taskName: "Identify the sport the boy is doing.",
    category: "Word Retrieval",
    createdBy: 'Dr. ABC',
    status: 'In progress'
  },
  {
    taskName: "Fill in the blank.",
    category: "Sentence Completion",
    createdBy: 'Dr. ABC',
    status: 'Not started'
  },
  {
    taskName: "Try to achieve 80%",
    category: "Article Reading",
    createdBy: 'Dr. ABC',
    status: 'Not started'
  },
];

const Tasks: React.FC<{ initialTasks?: Task[] }> = ({ initialTasks = dummyTasks }) => {
  const { appUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);
  const [ sessionToken ] = useState(appUser?.sessionToken);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [ tasks, setTasks ] = useState<Task[]>(initialTasks);
  const [ loading, setLoading ] = useState(false);
  const maxTasks = 5; // Maximum number of tasks to keep in memory
  const flatListRef = useRef<FlatList<Task>>(null);

  useEffect(() => {
    // Scroll to the bottom when tasks change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [tasks]);

  const renderTasks: ListRenderItem<Task> = ({ item, index }) => {
    return (
      <View key={index} className="flex-row mt-3">
        <View className="rounded-lg pl-1 pr-2 flex-1 bg-gray-200 dark:bg-gray-600 flex-row items-center">
          
          <View className="h-full w-2 bg-gray-400 mx-3"></View>
 
          <View className="ml-2 flex-1 py-3">
            <Text className='text-xl font-bold mb-2 text-dark dark:text-light'>{item.taskName}</Text>
            {
              item.category === 'Word Retrieval' ? (
                <View className='flex-row flex-1'>
                  <FontAwesome5 name="search" size={16} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 8 }} />
                  <Text className='text-sm mb-2 text-dark dark:text-light'>{item.category}</Text>
              </View>

              ) : item.category === 'Sentence Completion' ? (
                <View className='flex-row'>
                  <Octicons name="note" size={16} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 8 }} />
                  <Text className='text-sm mb-2 text-dark dark:text-light'>{item.category}</Text>
                </View>

              ) : item.category === 'Article Reading' ? (
                <View className='flex-row'>
                  <FontAwesome5 name="readme" size={16} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 8 }} />
                  <Text className='text-sm mb-2 text-dark dark:text-light'>{item.category}</Text>
                </View>

              ) : (
                <View className='flex-1'></View>
              )
            }

            <View className='flex-row'>
              <Fontisto name="doctor" size={18} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 10 }} />
              <Text className='text-sm mb-3 text-dark dark:text-light'>{item.createdBy}</Text>
            </View>
            
            <View className='absolute bottom-3 right-0'>
              {
                item.status === 'Completed' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#008000", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      router.push("/chatbot/chatbot")
                    }}>
                    <FontAwesome6 name="check-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.status}</Text>
                  </Pressable>
                  
                ) : item.status === 'In progress' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#F3960F", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      router.push("/chatbot/chatbot")
                    }}>
                    <FontAwesome6 name="pause-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.status}</Text>
                  </Pressable>

                ) : item.status === 'Not started' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#858585", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      router.push("/chatbot/chatbot")
                    }}>
                    <FontAwesome6 name="xmark-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.status}</Text>
                  </Pressable>
                ) : (
                  <View className='flex-1'></View>
                )
              }
            </View>
          </View>
        </View>
      </View>
    )
  };

  return (
    <View className="flex-1 flex-grow flex-shrink px-4 bg-light dark:bg-dark">
      <FlatList
        data={tasks}
        renderItem={renderTasks}
        keyExtractor={(item, index) => index.toString()}
        // onEndReached={loadMoreMessages} // Load more messages when end is reached
        onEndReachedThreshold={0.1} // Load more when 10% from the bottom
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: 4,
    paddingBottom: 128, // Ensure some space at the bottom for the overlay button
  },
  divider: {
    height: '100%',  // Full height to match the parent container
    width: 4,       // Thin line
    backgroundColor: '#d1d1d1',  // Color of the divider
    marginHorizontal: 10, // Space around the divider
  },
  actions:{
    borderRadius:16,
    marginHorizontal:8,
    paddingVertical:8,
    paddingHorizontal:16
  },
  actionText:{
    color:"#fff"
  }
});