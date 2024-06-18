import { StatusBar } from 'expo-status-bar';
import { Audio } from "expo-av";
import React, { useState, useRef, useEffect } from 'react';
import { Image, Text, View, FlatList, ListRenderItem, StyleSheet, Platform, Pressable} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import ErrorModal from "../../components/ErrorModal";
import DialogModal from "../../components/DialogModal";
import { images, icons } from "../../constants";
import { useAuthContext } from '../../context/AuthContext';

// Define types for messages
type Message = {
  role: 'Bot' | 'Patient';
  content: string;
};

const dummyMessages: Message[] = [
  {
    role: 'Bot',
    content: 'Great! Let us start with the first question! What is the boy doing?'
  },
  {
    role: 'Bot',
    content: 'https'
  },
  {
    role: 'Patient',
    content: 'Riding'
  },
  {
    role: 'Bot',
    content: 'Very close! Let me give you a hint. The object is a Bicycle. Now, what is the boy doing?'
  },
];

const dummyMessagesTwo: Message[] = [
  {
    role: 'Bot',
    content: 'Great! Let us start with the first question! What is the object shown?'
  },
  {
    role: 'Bot',
    content: 'https'
  },
  {
    role: 'Patient',
    content: 'Circle'
  },
  {
    role: 'Bot',
    content: 'Very close! Let me give you a hint. It is round, you can throw it, and kids love to play with it. Now, what is the object shown?'
  },
];


const Chatbot: React.FC<{ initialMessages?: Message[] }> = ({ initialMessages = dummyMessages }) => {
  const { appUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);

  const [ errorModalVisible, setErrorModalVisible ] = useState(false);
  const [ errorHeaderMessage, setErrorHeaderMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ dialogModalVisible, setDialogModalVisible ] = useState(false);
  const [ dialogHeaderMessage, setDialogHeaderMessage ] = useState('');
  const [ dialogMessage, setDialogMessage ] = useState('');

  // Task
  const [ isTaskSelected, setIsTaskSelected ] = useState(false);
  const [ selectedTask, setTaskSelected ] = useState('');
  const [ isSubmittingTask, setSubmittingTask ] = useState(false);

  const startTask = async(selectedTask: string) => {
    setSubmittingTask(true);

    if (selectedTask.length == 0) {
      setErrorHeaderMessage("MISSING_TASK")
      setErrorMessage("Please select a task.")
      setErrorModalVisible(true);
      setSubmittingTask(false);
    }
    else {
      try {
        // Send POST request for patient login
        // Use ipconfig to find ip address of your pc/emulator in the local network
        const response = await fetch('http://192.168.1.97:44818/api/patient/start-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: selectedTask,
          }),
        });

        const jsonResponse = await response.json();

        if (response.ok) {
          setTaskSelected(selectedTask);
          setIsTaskSelected(true);
        } else {
          // Handle errors
          setErrorHeaderMessage(jsonResponse.status)
          setErrorMessage(jsonResponse.message)
          setErrorModalVisible(true);
        }
      } catch (error) {
        console.error('Error:', error);
        if (error instanceof TypeError) { // Error such as Network request failed
          setErrorHeaderMessage("NETWORK_REQUEST_TIMED_OUT")
          setErrorMessage("There was a problem with the network request.")
          setErrorModalVisible(true);
        }    
      } finally {
        setSubmittingTask(false);
        
        // TEMPORARY
        setTaskSelected(selectedTask);
        setIsTaskSelected(true);
      }
    }
  }

  const quitTask = async() => {
    setSubmittingTask(true);

    if (selectedTask.length == 0) {
      setErrorHeaderMessage("MISSING_TASK")
      setErrorMessage("Please select a task.")
      setErrorModalVisible(true);
      setSubmittingTask(false);
    }
    else {
      try {
        // Send POST request for patient login
        // Use ipconfig to find ip address of your pc/emulator in the local network
        const response = await fetch('http://192.168.1.97:44818/api/patient/quit-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: selectedTask,
          }),
        });

        const jsonResponse = await response.json();

        if (response.ok) {
          setTaskSelected("");
          setIsTaskSelected(false);
        } else {
          // Handle errors
          setErrorHeaderMessage(jsonResponse.status)
          setErrorMessage(jsonResponse.message)
          setErrorModalVisible(true);
        }
      } catch (error) {
        console.error('Error:', error);
        if (error instanceof TypeError) { // Error such as Network request failed
          setErrorHeaderMessage("NETWORK_REQUEST_TIMED_OUT")
          setErrorMessage("There was a problem with the network request.")
          setErrorModalVisible(true);
        }    
      } finally {
        setSubmittingTask(false);

        // TEMPORARY
        setTaskSelected("")
        setIsTaskSelected(false);
      }
    }
  }

  // Message History
  const [ messages, setMessages ] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const maxMessages = 200; // Maximum number of messages to keep in memory
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage: ListRenderItem<Message> = ({ item, index }) => {
    if (item.role === "Bot") {
      if (item.content.includes('https')) {
        // Image Generated by the Chatbot
        return (
          <View key={index} className="flex-row justify-start items-start mt-3">
            {/* Chatbot Icon */}
            <Image
              className="w-9 h-9 rounded-full border-2 mr-2 border-gray-200 dark:border-white"
              source={icons.chatbot}
            />
            {/* Chatbot Image Message Bubble */}
            <View className="p-2 flex rounded-2xl bg-gray-200 dark:bg-gray-600">
              <Image
                source={images.cycling}
                className="rounded-xl"
                resizeMode="contain"
                style={{ height: 256, width: 256 }}
              />
            </View>
          </View>
        );
      } else {
        // Chatbot Response
        return (
          <View key={index} className="flex-row justify-start items-start mt-3">
            {/* Chatbot Icon */}
            <Image
              className="w-9 h-9 rounded-full border-2 mr-2 border-gray-200 dark:border-white"
              source={icons.chatbot}
            />
            {/* Chatbot Message Bubble */}
            <View className="rounded-xl p-2 flex-1 bg-gray-200 dark:bg-gray-600">
              <Text className='text-base text-dark dark:text-light'>{item.content}</Text>
            </View>
          </View>
        );
      }
    } else {
      // Patient Input
      return (
        // Patient Message Bubble
        <View key={index} className="rounded-xl p-2 ml-20 mt-3 bg-blue-500 dark:bg-blue-600">
          <Text className='text-base text-light'>{item.content}</Text>
        </View>
      );
    }
  };

  // Recording
  const [ isRecording, setIsRecording ] = useState(false);
  const [ recording, setRecording ] = useState<Audio.Recording | undefined>(undefined);
  const [ permissionResponse, requestPermission ] = Audio.usePermissions();

  const startRecording = async () => {
    try {
      if (!permissionResponse || permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);

      console.log('Recording started');
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        setRecording(undefined);

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        setIsRecording(false)

        // Send uri to backend

      } else {
        console.log('No recording to stop');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  useEffect(() => {
    // Cleanup function to stop the recording when the component unmounts
    return () => {
      if (recording) {
        stopRecording(); // You need to implement stopRecording function to stop and cleanup the recording
      }
    };
  }, [recording]);

  const {colorScheme, toggleColorScheme} = useColorScheme();

  const handleDialogModalOpen = () => {
    if (isTaskSelected && !isRecording) {
      setDialogHeaderMessage("QUIT_TASK")
      setDialogMessage("Are you sure you want to quit current task? All progress will be discarded and is irreversible!")
      setDialogModalVisible(true);
    }
    else {
      setErrorHeaderMessage("QUIT_TASK_ERROR")
      setErrorMessage("Something went wrong. Hmmm....")
      setErrorModalVisible(true);
    }
  };

  const handleDialogModalConfirm = () => {
    setDialogModalVisible(false);
    quitTask();
  };

  const handleDialogModalDismiss = () => {
    setDialogModalVisible(false);
  };

  return (
    <View className="flex-1 bg-light dark:bg-dark">
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
        onConfirm={handleDialogModalConfirm}
        onDismiss={handleDialogModalDismiss}
      />

      {messages.length > 0 ? (
        <View className="px-3 mb-6">
          {
            !isTaskSelected ? (
              // Chatbot Task Message
              <View className="flex-row justify-start items-start mt-3">
                <Image
                  className="w-9 h-9 rounded-full border-2 mr-2 border-gray-200 dark:border-white"
                  source={icons.chatbot}
                />
                <View className="rounded-xl p-2 flex-1 bg-gray-200 dark:bg-gray-600">
                  <Text className='text-base text-dark dark:text-light'>Welcome back, {username}! I am your personal virtual therapy assistant Stacy. Please select a task below to get started.</Text>
                  {/* List of Task */}
                  <View className='m-2'>
                    <Pressable style={({ pressed }) => [, pressed ? { opacity: 0.5 } : {},]} 
                        onPress={() => {
                            startTask("Word Retrieval Task");
                          }
                        }>
                      <View className="rounded-tr-xl rounded-tl-xl flex-row items-center p-3 bg-gray-300 dark:bg-blue-600">
                        <MaterialCommunityIcons name="numeric-1-circle-outline" size={24} color={colorScheme === 'dark' ? '#F9F9F9' : '#171717'}/>
                        <Text className='ml-2 text-base text-dark dark:text-light'>Word Retrieval Task</Text>
                      </View>
                    </Pressable>
                    <Pressable style={({ pressed }) => [, pressed ? { opacity: 0.5 } : {},]} 
                        onPress={() => {
                            // startTask("Sentence Completion Task");
                          }
                        }>
                      <View className="p-3 flex-row items-center bg-gray-300 dark:bg-blue-600">
                        <MaterialCommunityIcons name="numeric-2-circle-outline" size={24} color={colorScheme === 'dark' ? '#F9F9F9' : '#171717'} />
                        <Text className='ml-2 text-base text-dark dark:text-light'>Sentence Completion Task</Text>
                      </View>
                    </Pressable>
                    <Pressable style={({ pressed }) => [, pressed ? { opacity: 0.5 } : {},]} 
                        onPress={() => {
                            // startTask("Article Reading Task");
                          }
                        }>
                      <View className="rounded-br-xl rounded-bl-xl flex-row items-center p-3 bg-gray-300 dark:bg-blue-600">
                        <MaterialCommunityIcons name="numeric-3-circle-outline" size={24} color={colorScheme === 'dark' ? '#F9F9F9' : '#171717'}/>
                        <Text className='ml-2 text-base text-dark dark:text-light'>Article Reading Task</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                // onEndReached={loadMoreMessages} // Load more messages when end is reached
                onEndReachedThreshold={0.1} // Load more when 10% from the bottom
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                contentContainerStyle={styles.flatListContent}
              />
            )
          }
        </View>
      ) : (
        <View className='flex-1'></View>
      )}

      { isTaskSelected ? (
        <View className={`absolute bottom-0 left-0 right-0 justify-center items-center pt-1 ${Platform.OS === 'ios' ? 'pb-9' : 'pb-2'} bg-light dark:bg-dark`}>
          <Text className='text-base font-medium text-dark dark:text-light'>{isRecording ? "Recording..." : "Tap to start recording"}</Text>
          {isRecording ? (
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.5 } : {},
              ]}
              onPress={stopRecording}>
              <Ionicons name="stop-circle-sharp" size={96} color="#F44336"/>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.5 } : {},
              ]}
              onPress={startRecording}>
              <Ionicons name="radio-button-on-sharp" size={96} color="#fff"/>
            </Pressable>
          )}

          {!isRecording ? ( // Quit Task Button
            <View className='absolute right-10'>
              <Pressable
                style={({ pressed }) => [
                  pressed ? { opacity: 0.5 } : {},
                ]}
                onPress={handleDialogModalOpen}>
                <View className="rounded-3xl px-3 py-2 bg-neutral-400 dark:bg-neutral-500">
                  <Text className='text-base font-semibold text-light dark:text-light'> Quit </Text>
                </View>  
              </Pressable>
            </View>
          ) : ( // Clear Recording Button
            <View className='absolute right-10'>
              <Pressable
                style={({ pressed }) => [
                  pressed ? { opacity: 0.5 } : {},
                ]}
                onPress={stopRecording}>
                <View className="rounded-3xl px-3 py-2 bg-neutral-400 dark:bg-neutral-500">
                  <Text className='text-base font-semibold text-light dark:text-light'> Clear </Text>
                </View>  
              </Pressable>
            </View>
          )}

        </View>
      ) : (
        <View className='flex-1'></View>
      )}

    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: 4,
    paddingBottom: 128, // Ensure some space at the bottom for the overlay button
  },
});