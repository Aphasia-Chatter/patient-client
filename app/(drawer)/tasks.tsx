import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { router } from "expo-router";
import { Image, Text, View, FlatList, ListRenderItem, StyleSheet, Platform, Pressable, Button, ScrollView } from "react-native";
import { FontAwesome5, FontAwesome6, Octicons, Fontisto, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import ErrorModal from "../../components/ErrorModal";
import DialogModal from '../../components/DialogModal';
import TaskFilterModal from "../../components/TaskFilterModal";
import { useAuthContext } from '../../context/AuthContext';

type TaskFilterType = {
  categoryOfTask?: number;
};

type TaskData = {
  task_editor: {
    taskID: string;
    staffID: string;
    role: string;
  };
  task: {
    id: string;
    name: string;
    description: string;
    taskVisibility: string;
    createdAt: string;
  };
  word_retrieval_task: {
    taskID: string;
    imagePath: string;
    answer: string;
    inputRestriction: string
  };
}

const Tasks: React.FC<TaskData> = () => {
  const { appUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);
  const [ sessionToken ] = useState(appUser?.sessionToken);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [ isSubmitting, setSubmitting] = useState(false);
  const [ dataStatusMessage, setDataStatusMessage] = useState('')

  const [ errorModalVisible, setErrorModalVisible ] = useState(false);
  const [ errorHeaderMessage, setErrorHeaderMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ dialogModalVisible, setDialogModalVisible ] = useState(false);
  const [ dialogHeaderMessage, setDialogHeaderMessage ] = useState('');
  const [ dialogMessage, setDialogMessage ] = useState('');

  const [ tasks, setTasks ] = useState<TaskData[]>([]);
  const [ selectedTaskCategory, setSelectedTaskCategory] = useState(1); // Default set to word retrieval
  const [ selectedTaskCategoryName, setSelectedTaskCategoryName] = useState('Word Retrieval'); //

  const [ taskFilterModalVisible, setTaskFilterModalVisible ] = useState(false);
  const [ taskFilterHeaderMessage, setTaskFilterHeaderMessage ] = useState('');
  const [ taskFilterMessage, setTaskFilterMessage ] = useState('');

  const maxTasks = 5; // Maximum number of tasks to keep in memory
  const flatListRef = useRef<FlatList<TaskData>>(null);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async (additionalParams: TaskFilterType = {}) => {
    try {
      setDataStatusMessage("Loading task data...")

      const params = new URLSearchParams();
      if (appUser?.username) {
        params.append('username', appUser.username);
        console.log(appUser.username)
      }
      if (appUser?.sessionToken) {
        params.append('sessionToken', appUser.sessionToken);
        console.log(appUser.sessionToken)
      }

      let response: Response;
      let jsonResponse: any;

      // Send GET request
      // Use ipconfig to find ip address of your pc in the local network
      // Determine the endpoint based on the presence of the wordRetrievalTask key
      if (additionalParams.categoryOfTask == 1) {
        console.log('Cat 1');
        setSelectedTaskCategory(1);
        setSelectedTaskCategoryName('Word Retrieval')
        setTaskFilterModalVisible(false);

        response = await fetch(`http://192.168.1.97:44818/api/patient/get-word-retrieval-task?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        jsonResponse = await response.json();
        console.log('Cat 1');
  
        if (response.ok) {
          setTasks(jsonResponse.data.tasks);
          console.log('Word Retrieval Tasks:', jsonResponse.data.wordRetrievalTasks);
        } else {
          setDataStatusMessage("No word retrieval tasks found.");
        }
      } 
      else if (additionalParams.categoryOfTask == 2) {
        console.log('Cat 2');
        setSelectedTaskCategory(2);
        setSelectedTaskCategoryName('Sentence Retrieval')
        setTaskFilterModalVisible(false);

        response = await fetch(`http://192.168.1.97:44818/api/patient/get-sentence-retrieval-task?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        jsonResponse = await response.json();
        
        if (response.ok) {
          setTasks(jsonResponse.data.tasks);
          console.log('Sentence Retrieval Tasks:', jsonResponse.data.tasks);
        } else {
          setDataStatusMessage("No sentence retrieval tasks found.");
        }
      } 
      else if (additionalParams.categoryOfTask == 3) {
        console.log('Cat 3');
        setSelectedTaskCategory(3);
        setSelectedTaskCategoryName('Article Reading')
        setTaskFilterModalVisible(false);

        response = await fetch(`http://192.168.1.97:44818/api/patient/get-article-reading-task?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        jsonResponse = await response.json();
  
        if (response.ok) {
          setTasks(jsonResponse.data.tasks);
          console.log('Article Reading Tasks:', jsonResponse.data.tasks);
        } else {
          setDataStatusMessage("No article reading tasks found.");
        }
      } 
      else { // Default gets word retrieval task
        console.log('Default Route');
        response = await fetch(`http://192.168.1.97:44818/api/patient/get-word-retrieval-task?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        jsonResponse = await response.json();
  
        if (response.ok) {
          setTasks(jsonResponse.data.tasks);
          console.log('Tasks:', jsonResponse.data.tasks);
        } else {
          setDataStatusMessage("No word retrieval tasks found.");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof TypeError) { // Error such as Network request failed
        setErrorHeaderMessage("NETWORK_REQUEST_TIMED_OUT")
        setErrorMessage("There was a problem with the network request.")
        setErrorModalVisible(false); // TODO Remember to set back to true

        setDataStatusMessage("Network Error.\nPlease check your internet connection.");
      }      
    } finally {
      setSubmitting(false);
    }
  }

  const createSession = async (...args: any[]) => {
    // TODO 
  }

  const renderWordRetrievalTaskItem: ListRenderItem<TaskData> = ({ item, index }) => {
    return (
      <View key={index} className="flex-row mt-3">
        <View className="rounded-lg pl-1 pr-2 flex-1 bg-gray-200 dark:bg-gray-600 flex-row items-center">
          <View className="h-full w-2 bg-gray-400 mx-3"></View>
          <View className="ml-2 flex-1 py-3">
            <Text className='text-xl font-bold mb-2 text-dark dark:text-light'>{item.task.name}</Text>
              <View className='flex-row flex-1'>
                <FontAwesome5 name="search" size={16} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 8 }} />
                <Text className='text-sm mb-2 text-dark dark:text-light'>Word Retrieval</Text>
              </View>
            <View className='flex-row'>
              <Fontisto name="doctor" size={18} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 10 }} />
              <Text className='text-sm mb-3 text-dark dark:text-light'>{item.task_editor.staffID}</Text>
            </View>
            
            <View className='absolute bottom-3 right-0'>
              {
                item.task.description === 'Completed' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#008000", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      router.push("/chatbot/chatbot")
                    }}>
                    <FontAwesome6 name="check-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.task.description}</Text>
                  </Pressable>
                  
                ) : item.task.description === 'In progress' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#F3960F", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      router.push("/chatbot/chatbot")
                    }}>
                    <FontAwesome6 name="pause-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.task.description}</Text>
                  </Pressable>

                ) : item.task.description === 'Not started' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#858585", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      router.push("/chatbot/chatbot")
                    }}>
                    <FontAwesome6 name="xmark-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.task.description}</Text>
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
    <View className="flex-1 flex-grow flex-shrink px-4 pt-6 bg-light dark:bg-dark">
      <ErrorModal 
        headerMessage={errorHeaderMessage}
        errorMessage={errorMessage}
        modalVisible={errorModalVisible}
        setModalVisible={setErrorModalVisible}
      />
      <DialogModal 
        headerMessage={dialogHeaderMessage}
        dialogMessage={dialogMessage}
        modalVisible={dialogModalVisible}
        setModalVisible={setDialogModalVisible}
        onConfirm={createSession}
        onDismiss={() => setDialogModalVisible(false)}
      />
      <TaskFilterModal 
        headerMessage={taskFilterHeaderMessage}
        taskFilterMessage={taskFilterMessage}
        modalVisible={taskFilterModalVisible}
        setModalVisible={setTaskFilterModalVisible}
        onConfirm={(categoryOfTask) => fetchAllTasks({ categoryOfTask })}
        onDismiss={() => setTaskFilterModalVisible(false)}
      />
      <View className='flex-row justify-center'>
        <Pressable
          style={({ pressed }) => [
            pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#02A9E0", position: 'absolute', right: 0}
          ]}
          onPress={() => {
            // Filter Function
            setTaskFilterHeaderMessage("Filter Task")
            setTaskFilterMessage("Please filter the task to your liking.")
            setTaskFilterModalVisible(true);
          }}>
          <MaterialCommunityIcons name="filter-variant" size={24} color='#fff'/>
        </Pressable>
        <Text className='font-bold text-center text-2xl text-dark dark:text-light'>{selectedTaskCategoryName}</Text>
      </View>

      <ScrollView
        className='flex-grow'
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
      {
        tasks.length == 0 ? (
          <View className='flex-1 justify-center align-bottom items-center'>
            <Text className='font-bold text-xl mb-4 text-center text-dark dark:text-light'>{dataStatusMessage}</Text>
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#02A9E0"}
              ]}
              onPress={() => {
                // Refresh Button
                fetchAllTasks();
              }}>
              <View className='flex-row p-1'>
                <SimpleLineIcons name="refresh" size={26} color='#fff' style={{ marginRight: 10 }} />
                <Text className='text-lg' style={styles.actionText}>Refresh</Text>
              </View>
            </Pressable>
          </View>
        ) : tasks.length > 0 && selectedTaskCategory == 1 ? (
          <FlatList
            data={tasks}
            renderItem={renderWordRetrievalTaskItem}
            keyExtractor={(item, index) => index.toString()}
            // onEndReached={loadMoreMessages} // Load more messages when end is reached
            onEndReachedThreshold={0.1} // Load more when 10% from the bottom
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            contentContainerStyle={styles.flatListContent}
          />

        ) : tasks.length > 0 && selectedTaskCategory == 2 ? (
          <></>
        ) : tasks.length > 0 && selectedTaskCategory == 3 ? (
          <></>
        ) : (
          <></>
        )
      }
      </ScrollView>
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
    borderRadius: 16,
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  actionText:{
    color:"#fff"
  },

  ////////////////
});