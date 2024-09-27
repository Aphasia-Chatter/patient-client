import { StatusBar } from 'expo-status-bar';
import { Audio } from "expo-av";
import React, { useState, useRef, useEffect } from 'react';
import { Image, ImageBackground, Text, View, FlatList, ListRenderItem, StyleSheet, Platform, Pressable, Button, RefreshControl, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';

import { useLocalSearchParams } from 'expo-router'

import ErrorModal from "../../components/ErrorModal";
import { images, icons } from "../../constants";
import { useAuthContext } from '../../context/AuthContext';
import TaskDetailsModal from '@/components/TaskDetailsModal';

type PatientWordRetrievalTaskImageData = {
  path: string;
  data: string;
};

// Define types for messages
type Message = {
  author: 'bot' | 'user';
  content: string;
  isTTSPlaying?: boolean;
};

const Chatbot: React.FC<{ initialMessages?: Message[] }> = ({ initialMessages = [] }) => {
  const { taskCategory, filePath, taskSessionID, taskID, completedAt } = useLocalSearchParams()

  const { appUser } = useAuthContext();
  const { colorScheme } = useColorScheme();

  const [ refreshing, setRefreshing ] = useState(false);

  const [ wordRetrievalImageData, setWordRetrievalImageData ] = useState<PatientWordRetrievalTaskImageData | null>(null);

  const [ errorModalVisible, setErrorModalVisible ] = useState(false);
  const [ errorHeaderMessage, setErrorHeaderMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ taskDetailsModalVisible, setTaskDetailsModalVisible ] = useState(false);
  const [ taskName, setTaskName ] = useState('');
  const [ taskDescription, setTaskDescription ] = useState('');
  const [ isTaskCompleted, setIsTaskCompleted ] = useState(completedAt);

  // Message History
  const [ messages, setMessages ] = useState<Message[]>(initialMessages);
  const flatListRef = useRef<FlatList<Message>>(null);
  const previousMessageCount = useRef(messages.length);

  // TTS Status
  const [ isTTSPlaying, setIsTTSPlaying ] = useState(false);

  useEffect(() => {
    console.log("Params", { taskCategory, taskID, filePath, taskSessionID, completedAt, isTaskCompleted, taskName });
  
    if (typeof taskCategory === 'string' && typeof taskID === 'string' && typeof filePath === 'string') {
      if (taskCategory === "1") {
        // Get word retrieval task
        fetchWordRetrievalTask();
  
        // Get word retrieval image
        fetchWordRetrievalTaskImage(filePath);
  
        // TODO: Get word retrieval chat history at launch
        fetchAllWordRetrievalSessionChatHistory();
      }
    } else {
      console.error('Invalid task category, task id or filePath');
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      // TODO: Refresh word retrieval chat history
      await fetchAllWordRetrievalSessionChatHistory();

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }

      setRefreshing(false);
    }, 600);
  }, []);

  const fetchAllWordRetrievalSessionChatHistory = async () => {
    const controller = new AbortController();
    const timeout = 5000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(`https://aphasia.mooo.com/api/patient/chat-histories/`, {
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
        signal: signal
      })

      // Clear the timeout if the request is successful
      clearTimeout(timeoutId);

      const jsonResponse = await response.json();

      if (response.ok) {
        // Set chat history messages
        setMessages(jsonResponse.data.messages);
      } else {
        setErrorHeaderMessage("FETCH_CHAT_HISTORY_FAILED")
        setErrorMessage(jsonResponse['message'])
        setErrorModalVisible(false);
      }
    }
    catch (error) {
      console.error('Error:', error);
      if (signal.aborted) {
        setErrorHeaderMessage("NETWORK REQUEST TIMED_OUT")
        setErrorMessage("The request has been aborted due to timeout.")
        setErrorModalVisible(true);
      }
      else if (error instanceof TypeError) { // Error such as Network request failed
        setErrorHeaderMessage("NETWORK REQUEST ERROR")
        setErrorMessage("There was a problem with the network request.")
        setErrorModalVisible(true);
      }   
    }
  };

  const fetchWordRetrievalTask = async () => {
    const controller = new AbortController();
    const timeout = 5000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

     try {
        const params = new URLSearchParams();
        params.append('taskID', taskID?.toString() ?? '');
        const response = await fetch(`https://aphasia.mooo.com/api/patient/get-word-retrieval-task-by-id?${params.toString()}`, {
           method: 'GET',
           headers: {
              'Content-Type': 'application/json',
           },
           signal: signal
          });
        
        // Clear the timeout if the request is successful
        clearTimeout(timeoutId);
        
        const jsonResponse = await response.json();

        if (response.ok) {
          const data = jsonResponse.data;
          const name = data.task.name;
          const description = data.task.description;
          setTaskName(name);
          setTaskDescription(description);
        }
     } catch(error) {
        console.error('Error:', error);
        if (signal.aborted) {
          setErrorHeaderMessage("NETWORK REQUEST TIMED_OUT")
          setErrorMessage("The request has been aborted due to timeout.")
          setErrorModalVisible(true);
        }
        else if (error instanceof TypeError) { // Error such as Network request failed
          setErrorHeaderMessage("NETWORK REQUEST ERROR")
          setErrorMessage("There was a problem with the network request.")
          setErrorModalVisible(true);
        }   
     }
  }

  const fetchWordRetrievalTaskImage = async (imagePath: string) => {
    const controller = new AbortController();
    const timeout = 5000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const params = new URLSearchParams();

      if (appUser?.username) {
        params.append('username', appUser.username);
      }
      if (appUser?.sessionToken) {
        params.append('sessionToken', appUser.sessionToken);
      }

      params.append('filePath', imagePath);

      const response = await fetch(`https://aphasia.mooo.com/api/patient/get-word-retrieval-task-image?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: signal
      });

      // Clear the timeout if the request is successful
      clearTimeout(timeoutId);

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
      if (signal.aborted) {
        setErrorHeaderMessage("NETWORK REQUEST TIMED_OUT")
        setErrorMessage("The request has been aborted due to timeout.")
        setErrorModalVisible(true);
      }
      else if (error instanceof TypeError) { // Error such as Network request failed
        setErrorHeaderMessage("NETWORK REQUEST ERROR")
        setErrorMessage("There was a problem with the network request.")
        setErrorModalVisible(true);
      }      
    } finally {
      setSubmitting(false);
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item, index }) => {
    const toggleTTS = () => {
      // Update the message state
      const updatedMessages = messages.map((msg, idx) => {
        if (idx === index) {
          // Toggle the TTS playing state
          const newTTSState = !msg.isTTSPlaying;
          if (newTTSState) {
            // If it's going to play, stop any currently playing TTS
            Speech.stop();

            // Start TTS
            Speech.speak(msg.content, {
              rate: 0.7,
              pitch: 1,
              voice:"com.apple.voice.compact.en-US.Samantha",
              onStart:() => setIsTTSPlaying(true), 
              onPause:() => setIsTTSPlaying(false), 
              onResume:() => setIsTTSPlaying(true),
              onDone:() => {
                setIsTTSPlaying(false)
                
                // Update the message state to set isTTSPlaying to false
                setMessages(prevMessages =>
                  prevMessages.map((m, i) =>
                    i === index ? { ...m, isTTSPlaying: false } : m
                  )
                );
              },
              onStopped:() => {
                setIsTTSPlaying(false)
                
                // Ensure message state is also updated here
                setMessages(prevMessages =>
                  prevMessages.map((m, i) =>
                    i === index ? { ...m, isTTSPlaying: false } : m
                  )
                );
              },
              onError: () => {
                setIsTTSPlaying(false)

                // Handle error
                setMessages(prevMessages =>
                  prevMessages.map((m, i) =>
                    i === index ? { ...m, isTTSPlaying: false } : m
                  )
                );
              }
            });
          } else {
            Speech.stop(); // Stop TTS
          }
          return { ...msg, isTTSPlaying: newTTSState };
        }
        return msg;
      });
  
      setMessages(updatedMessages); // Update the messages state
    };
  
    if (item.author === "bot") {
      // Chatbot Response
      return (
        <>
          <View key={index} className="flex-row justify-start items-start mt-3 mr-5">
            {/* Chatbot Icon */}
            <Image
              className="w-9 h-9 rounded-full border-2 mr-2 border-gray-200 dark:border-white"
              source={icons.chatbot}
            />
            {/* Chatbot Message Bubble */}
            <View className="rounded-xl p-2 bg-gray-200 dark:bg-gray-600">
              {/* Chatbot Message Content */}
              <Text className='text-base text-dark dark:text-light'>{item.content}</Text>
  
              {/* Chatbot Message TTS Button */}
              <Pressable 
                key={index}
                style={({ pressed }) => [
                  pressed ? { opacity: 0.7 } : {}, 
                  { 
                    ...styles.actions,
                    marginTop: 12,
                    margin: 4,
                    backgroundColor: item.isTTSPlaying ? "red" : "green" // Change color based on TTS state
                  }
                ]}
                onPress={toggleTTS}>
                {
                  item.isTTSPlaying ? (
                    <MaterialCommunityIcons name="text-to-speech-off" size={24} color='#fff'/>
                  ) : (
                    <MaterialCommunityIcons name="text-to-speech" size={24} color='#fff'/>
                  )
                }
              </Pressable>
            </View>
          </View>
  
          {/* Recording Animation */}
          {
            isRecording && (
              <View key={index} className="rounded-xl p-2 ml-20 mt-3 bg-blue-500 dark:bg-blue-600">
                <Text className='text-base text-light'>......</Text>
              </View>
            )
          }
        </>
      );
    } else {
      // Patient Input
      return (
        // Patient Message Bubble
        <>
          {
            item.content.length == 0 ? (
              <View key={index} className="rounded-xl p-2 ml-20 mt-3 bg-orange-500 dark:bg-orange-600">
                <Text className='text-base text-light'>Invalid input. Please try again</Text>
              </View>
            ) : (
              <View key={index} className="rounded-xl p-2 ml-20 mt-3 bg-blue-500 dark:bg-blue-600">
                <Text className='text-base text-light'>{item.content}</Text>
              </View>
            )
          }
        </>
      );
    }
  };

  useEffect(() => {
    // Cleanup function to stop speech when exiting the page
    return () => {
      console.log('Stopping Speech');
      Speech.stop(); // Stop the speech synthesis
    };
  }, []); // Empty dependency array means this runs on unmount
  
  // Recording
  const [ isRecording, setIsRecording ] = useState(false);
  const [ recording, setRecording ] = useState<Audio.Recording>();
  const [ permissionResponse, requestPermission ] = Audio.usePermissions();
  const [ isSubmitting, setSubmitting ] = useState(false);

  const startRecording = async () => {
    try {
      if (!permissionResponse || permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix; If this option is set, your experience's audio interrupts audio from other apps.
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: true,
        interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix; If this option is set, your experience's audio interrupts audio from other apps.
        shouldDuckAndroid: true, // Prevent audio from other apps to pause your audio
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

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

      const controller = new AbortController();
      const timeout = 5000;
      const signal = controller.signal;
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);
      
      try {
        const response = await fetch('https://aphasia.mooo.com/api/patient/chat-session-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data', // Indicate request body contains form data that includes files (due to large blocks of data)
          },
          body: formData,
          signal: signal
        });

        // Clear the timeout if the request is successful
        clearTimeout(timeoutId);

        const result = await response.json();

        if (response.ok) {
          // Get chatbot response from the backend
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
            setIsTaskCompleted("true");
            Alert.alert('Task Completed!')
          }
        }
      } catch (error) {
        console.error('Error:', error);
        if (signal.aborted) {
          setErrorHeaderMessage("NETWORK REQUEST TIMED_OUT")
          setErrorMessage("The request has been aborted due to timeout.")
          setErrorModalVisible(true);
        }
        else if (error instanceof TypeError) { // Error such as Network request failed
          setErrorHeaderMessage("NETWORK REQUEST ERROR")
          setErrorMessage("There was a problem with the network request.")
          setErrorModalVisible(true);
        } 
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
    if (flatListRef.current && messages.length !== previousMessageCount.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      previousMessageCount.current = messages.length; // Update the previous count
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
      <TaskDetailsModal
        name={taskName}
        description={taskDescription}
        status={isTaskCompleted}
        modalVisible={taskDetailsModalVisible}
        setModalVisible={setTaskDetailsModalVisible}
      />
      {
        messages.length > 0 ? (
          <View className="px-3 mb-6 flex-1">
            {/* Centered Container */}
            <View className="flex justify-center items-center w-full mt-3 my-3">
              {/* Chatbot Image Message Bubble */}
              <Pressable onPress={() => {
                setTaskDetailsModalVisible(true);
              }} className="p-2 flex rounded-2xl bg-gray-200 dark:bg-gray-600">
                <ImageBackground 
                  className="rounded-xl max-h-64 max-w-64 bg-white aspect-square p-4"
                  resizeMode="cover"
                >
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${wordRetrievalImageData?.data}`}}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </ImageBackground>
              </Pressable>
            </View>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              keyboardShouldPersistTaps="handled" // Change this to handled
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true })
              }}
              contentContainerStyle={styles.flatListContent}
              ListFooterComponent={<View style={{height: 105}} pointerEvents="none"/>}
              style={{ 
                marginBottom: isTaskCompleted ? 25 : 0
              }} 
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          </View>
      ) : (
        <View className='flex-1'></View>
      )}

      {isTaskCompleted === "null" && (
        <View className={`absolute bottom-0 left-0 right-0 justify-center items-center pt-1 ${Platform.OS === 'ios' ? 'pb-9' : 'pb-2'} bg-light dark:bg-dark`}>
          <Text className='text-sm font-medium text-dark dark:text-light'>{isRecording ? "Tap and submit your answer" : "Tap and say your answer"}</Text>
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
  actions:{
    borderRadius: '100%',
    paddingVertical: 4,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText:{
    color:"#fff",
    fontSize: 12
  },
});