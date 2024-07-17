import { StatusBar } from 'expo-status-bar';
import { Audio } from "expo-av";
import React, { useState, useRef, useEffect } from 'react';
import { Image, ImageBackground, Text, View, FlatList, ListRenderItem, StyleSheet, Platform, Pressable, Button, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import * as FileSystem from 'expo-file-system';

import { useLocalSearchParams } from 'expo-router'

import ErrorModal from "../../components/ErrorModal";
import { images, icons } from "../../constants";
import { useAuthContext } from '../../context/AuthContext';

type PatientWordRetrievalTaskImageData = {
  path: string;
  data: string;
};

// Define types for messages
type Message = {
  author: 'bot' | 'user';
  content: string;
};

const dummyMessages: Message[] = [
  

  // Suggested Patient response's content structure
  // Content : {transcribed word}}

  // Suggested Bot response content structure
  // Content (initial): Observe the above image. Please give a 1-word response. {taskName}}
  // Content (1-word response incorrect): {Bot response's feedback}. {Hint}. {taskName}}
  // Content (1-word response correct): {Bot response's feedback}.}
];

const Chatbot: React.FC<{ initialMessages?: Message[] }> = ({ initialMessages = dummyMessages }) => {
  const { taskCategory, filePath, taskSessionID, taskID, completedAt } = useLocalSearchParams()

  const { appUser } = useAuthContext();
  const { colorScheme } = useColorScheme();

  const [ refreshing, setRefreshing ] = useState(false);

  const [ wordRetrievalImageData, setWordRetrievalImageData ] = useState<PatientWordRetrievalTaskImageData | null>(null);

  const [ errorModalVisible, setErrorModalVisible ] = useState(false);
  const [ errorHeaderMessage, setErrorHeaderMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  // name and title
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Message History
  const [ messages, setMessages ] = useState<Message[]>(initialMessages);
  const [ loading, setLoading ] = useState(false);
  const maxMessages = 200; // Maximum number of messages to keep in memory
  const flatListRef = useRef<FlatList<Message>>(null);

  // Completed
  const [completed, setCompleted] = useState(completedAt);

  useEffect(() => {
    console.log("Params", { taskCategory, taskID, filePath, taskSessionID, completedAt});
  
    if (typeof taskCategory === 'string' && typeof taskID === 'string' && typeof filePath === 'string') {
      if (taskCategory === "1") {
        console.log(completed)
        // Get word retrieval task
        fetchWordRetrievalTask();
  
        // Get word retrieval image
        fetchWordRetrievalTaskImage(filePath);

        console.log(filePath);
  
        // TODO: Get word retrieval chat history at launch
        fetchAllWordRetrievalSessionChatHistory();
      }
    } else {
      console.error('Invalid task category, task id or filePath');
    }
  
    // Scroll to the bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      // TODO: Refresh word retrieval chat history
      // await fetchAllWordRetrievalSessionChatHistory();
      setRefreshing(false);
    });
  }, []);

  const fetchAllWordRetrievalSessionChatHistory = async () => {
    try {
      const response = await fetch(`http://192.168.50.248:44818/api/patient/chat-histories/`, {
        body: JSON.stringify({
          "username": appUser?.username,
          "sessionToken": appUser?.sessionToken,
          "taskSessionID": taskSessionID,
          "taskCategory": taskCategory,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log(appUser);

      const jsonResponse = await response.json();

      console.log(jsonResponse);

      if (response.ok) {
        // Set chat history messages
        console.log(`Messages: ${jsonResponse.data.messages[0]}`);
        setMessages(jsonResponse.data.messages);
      } else {
        setErrorHeaderMessage("FETCH_CHAT_HISTORY_FAILED")
        setErrorMessage(jsonResponse['message'])
        setErrorModalVisible(false);
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchWordRetrievalTask = async () => {
     try {
        const params = new URLSearchParams();
        params.append('taskID', taskID?.toString() ?? '');
        const response = await fetch(`http://192.168.50.248:44818/api/patient/get-word-retrieval-task-by-id?${params.toString()}`, {
           method: 'GET',
           headers: {
              'Content-Type': 'application/json',
           }
          });
        
        const jsonResponse = await response.json();
        if (response.ok) {
          const data = jsonResponse.data;
          const name = data.task.name;
          const description = data.task.description;
          setName(name);
          setDescription(description);
        }
     } catch(error) {
        console.error('Error:', error);
     }
  }

  const fetchWordRetrievalTaskImage = async (imagePath: string) => {
    try {
      const params = new URLSearchParams();

      if (appUser?.username) {
        params.append('username', appUser.username);
      }
      if (appUser?.sessionToken) {
        params.append('sessionToken', appUser.sessionToken);
      }

      params.append('filePath', imagePath);

      const response = await fetch(`http://192.168.50.248:44818/api/patient/get-word-retrieval-task-image?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const jsonResponse = await response.json();

      if (response.ok) {
        setWordRetrievalImageData(jsonResponse);
      } else {
        setErrorHeaderMessage("FETCH_IMAGE_FAILED")
        setErrorMessage(jsonResponse)
        setErrorModalVisible(false);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof TypeError) { // Error such as Network request failed
        setErrorHeaderMessage("NETWORK_REQUEST_TIMED_OUT")
        setErrorMessage("There was a problem with the network request.")
        setErrorModalVisible(true);
      }      
    } finally {
      setSubmitting(false);
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item, index }) => {
    if (item.author === "bot") {
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
const [isRecording, setIsRecording] = useState(false);
const [recording, setRecording] = useState<Audio.Recording>();
const [permissionResponse, requestPermission] = Audio.usePermissions();
const [isSubmitting, setSubmitting] = useState(false);

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
    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);

    console.log('Recording started');
    setIsRecording(true);
  } catch (err) {
    console.error('Failed to start recording', err);
  }
};

const stopRecording = async () => {
  try {
    if (recording) {
      console.log('Stopping recording..');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const recordingUri = recording.getURI();
      console.log('Recording stopped and stored at', recordingUri);

      sendRecording(recordingUri);

      setIsRecording(false);
    } else {
      console.log('No recording to stop');
    }
  } catch (err) {
    console.error('Failed to stop recording', err);
  }
};

const playRecording = async () => {
  if (recording != null) {
    const uri = recording.getURI();

    if (uri != null) {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync({ uri });

      console.log('Playing Sound');
      await sound.playAsync();
    }
  }
};

const sendRecording = async (recordingUri: string | null) => {
  if (recordingUri != null) {
    // Encode recording content as a Base64 string
    const recordingBase64 = await FileSystem.readAsStringAsync(recordingUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const recordingBlob = await FileSystem.readAsStringAsync(recordingUri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    // Attach the Base64 string to the key 'audioFile'
    const formData = new FormData();
    formData.append('audioFileData', recordingBlob);
    formData.append('audioFilePath', recordingUri);
    formData.append('username', appUser?.username || '');
    formData.append('sessionToken', appUser?.sessionToken || '');
    formData.append('taskSessionID', taskSessionID?.toString() || '');

    console.log(formData)
    
    try {
      const response = await fetch('http://192.168.50.248:44818/api/patient/chat-session-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate request body contains form data that includes files (due to large blocks of data)
        },
        body: formData,
      });

      const result = await response.json();

      console.log(result);

      if (response.status === 200) {
        // Get chatbot response from the backend
        console.log("success");
        console.log("transcription from backend:", result.data.transcription);

        // Update chat history
        const newMessages = [...messages];
        newMessages.push({
          author: 'user',
          content: result.data.transcription,
        }, {
          author: 'bot',
          content: result.data.message,
        });
        setMessages(newMessages);

        if (result.data.completed) {
          setCompleted("true");
        }
      }
    } catch (error) {
      console.log(error);
      console.log("not success");
    }
  }
};

  useEffect(() => {
    return recording
      ? () => {
          console.log('Unloading Sound');
          recording.stopAndUnloadAsync();
        }
      : undefined;
  }, [recording]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View className="flex-1 bg-light dark:bg-dark">
      <ErrorModal 
        headerMessage={errorHeaderMessage}
        errorMessage={errorMessage}
        modalVisible={errorModalVisible}
        setModalVisible={setErrorModalVisible}
      />
      {
        messages.length >= 0 ? (
          <View className="px-3 mb-6">
            {/* Centered Container */}
            <View className="flex justify-center items-center w-full mt-3">
              <Text className='text-xl text-dark dark:text-light' style={{ fontWeight: 'bold' }}>{description}</Text>
            </View>
            <View className="flex justify-center items-center w-full mt-3">
              {/* Chatbot Image Message Bubble */}
              <View className="p-2 flex rounded-2xl bg-gray-200 dark:bg-gray-600">
                <ImageBackground className="rounded-xl max-h-64 max-w-64 bg-white aspect-square p-4">
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${wordRetrievalImageData?.data}` }}
                    className="flex-1 w-full h-full aspect-square"
                    resizeMode="contain"
                  />
                </ImageBackground>
              </View>
            </View>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => index.toString()}
              // onEndReached={loadMoreMessages} // Load more messages when end is reached
              onEndReachedThreshold={0.1} // Load more when 10% from the bottom
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              contentContainerStyle={[styles.flatListContent, { paddingBottom: 500 }]} // Increased padding to the bottom
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
            <View>
              <Text className='text-justify text-dark dark:text-light'>
                Recording
              </Text>
              <Button onPress={playRecording} title="Play"></Button>
            </View>
          </View>
      ) : (
        <View className='flex-1'></View>
      )}

      {completed === "null" ? (
        <View className={`absolute bottom-0 left-0 right-0 justify-center items-center pt-1 ${Platform.OS === 'ios' ? 'pb-9' : 'pb-2'} bg-light dark:bg-dark`}>
          <Text className='text-base font-medium text-dark dark:text-light'>{isRecording ? "Tap and submit your answer" : "Tap and say your answer"}</Text>
          {isRecording ? (
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.5 } : {},
              ]}
              onPress={stopRecording}>
              <Ionicons name="stop-circle-sharp" size={96} color={(colorScheme === 'dark' ? '#F44336' : '#F44336')}/>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.5 } : {},
              ]}
              onPress={startRecording}>
              <Ionicons name="radio-button-on-sharp" size={96} color={(colorScheme === 'dark' ? '#F44336' : '#F44336')}/>
            </Pressable>
          )}
      
          {isRecording ? ( // Clear Recording Button
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
          ) : ( 
            <View className='flex-1'></View>
          )}
        </View>
      ) : (
        <View className='absolute bottom-0 left-0 right-0 justify-center items-center pt-1 pb-10 bg-light dark:bg-dark'>
          <Text className='text-xl font-medium text-dark dark:text-light'>Word Retrieval Task Completed!</Text>
        </View>
      )}
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: 4,
    paddingBottom: 148, // Ensure some space at the bottom for the overlay button
  },
});