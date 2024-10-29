
import React, { useState, useRef, useEffect } from 'react';
import { Image, ImageBackground, Text, View, FlatList, ListRenderItem, StyleSheet, Platform, Pressable, RefreshControl } from "react-native";
import { useLocalSearchParams } from 'expo-router'
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import TaskDetailsModal from '@/components/TaskDetailsModal';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from "../../components/ErrorModal";

import { useAuthContext } from '../../context/AuthContext';
import { images } from "../../constants";

export type PatientWordRetrievalTaskImageData = {
  path: string;
  data: string;
};

// Define types for messages
export type Message = {
  author: 'bot' | 'user';
  content: string;
  isTTSPlaying?: boolean;
};

const Chatbot: React.FC<{ initialMessages?: Message[] }> = ({ initialMessages = [] }) => {
  const { taskCategory, filePath, taskSessionID, taskID, completedAt } = useLocalSearchParams()

  const { appUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);
  const [ sessionToken ] = useState(appUser?.sessionToken);

  const [ refreshing, setRefreshing ] = useState(false);

  const [ wordRetrievalImageData, setWordRetrievalImageData ] = useState<PatientWordRetrievalTaskImageData | null>(null);

  const [ errorModalVisible, setErrorModalVisible ] = useState(false);
  const [ errorHeaderMessage, setErrorHeaderMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');
  
  const [ successModalVisible, setSuccessModalVisible ] = useState(false);
  const [ successHeaderMessage, setSuccessHeaderMessage ] = useState('');
  const [ successMessage, setSuccessMessage ] = useState('');

  const [ taskDetailsModalVisible, setTaskDetailsModalVisible ] = useState(false);
  const [ taskName, setTaskName ] = useState('');
  const [ taskDescription, setTaskDescription ] = useState('');
  const [ isTaskCompleted, setIsTaskCompleted ] = useState(completedAt);

  // Message History
  const [ messages, setMessages ] = useState<Message[]>(initialMessages);
  const flatListRef = useRef<FlatList<Message>>(null);
  const previousMessageCount = useRef(messages.length);
  const [ scrollEnabled, setScrollEnabled ] = useState(true)

  // TTS Status
  const [ isTTSPlaying, setIsTTSPlaying ] = useState(false);

  // Recording
  const [ isRecording, setIsRecording ] = useState(false);
  const [ recording, setRecording ] = useState<Audio.Recording>();
  const [ permissionResponse, requestPermission ] = Audio.usePermissions();
  const [ isRecordingSubmitting, setIsRecordingSubmitting ] = useState(false);

  useEffect(() => {
    console.log("Params", { taskCategory, taskID, filePath, taskSessionID, completedAt, isTaskCompleted, taskName });

    if (typeof taskCategory === 'string' && typeof taskID === 'string' && typeof filePath === 'string') {
      if (taskCategory === "1") {
        // Get word retrieval task
        fetchWordRetrievalTask();
  
        // Get word retrieval image
        fetchWordRetrievalTaskImage(filePath);
  
        // Get word retrieval chat history
        fetchAllWordRetrievalSessionChatHistory();
      }
    } else {
      setErrorHeaderMessage("INVALID_PARAMS")
      setErrorMessage("An error has occurred.\nPlease refresh or try again later.")
      setErrorModalVisible(true);
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      // Refresh word retrieval chat history
      await fetchAllWordRetrievalSessionChatHistory();

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }

      setRefreshing(false);
    }, 600);
  }, []);

  const fetchWordRetrievalTask = async () => {
    const controller = new AbortController();
    const timeout = 10000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      if ((username == undefined || sessionToken == undefined) || username.length == 0 || sessionToken.length == 0) {
        setErrorHeaderMessage("INVALID_USERNAME_SESSION")
        setErrorMessage("Invalid username and/or session token.")
        setErrorModalVisible(true);
      }
      else {
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
    const timeout = 10000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      if ((username == undefined || sessionToken == undefined) || username.length == 0 || sessionToken.length == 0) {
        setErrorHeaderMessage("INVALID_USERNAME_SESSION")
        setErrorMessage("Invalid username and/or session token.")
        setErrorModalVisible(true);
      }
      else {
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
  };

  const fetchAllWordRetrievalSessionChatHistory = async () => {
    const controller = new AbortController();
    const timeout = 10000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      if ((username == undefined || sessionToken == undefined) || username.length == 0 || sessionToken.length == 0) {
        setErrorHeaderMessage("INVALID_USERNAME_SESSION")
        setErrorMessage("Invalid username and/or session token.")
        setErrorModalVisible(true);
      }
      else {
        const response = await fetch(`https://aphasia.mooo.com/api/patient/chat-histories/`, {
          body: JSON.stringify({
            "username": username,
            "sessionToken": sessionToken,
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
              rate: 0.3,
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
              source={images.chatbot}
              accessibilityLabel="bot icon image"/>

            {/* Chatbot Message Bubble */}
            <View
              className="rounded-xl p-2 mr-5 bg-gray-200 dark:bg-gray-600"
              accessibilityLabel="bot message bubble">

              {/* Chatbot Message Content */}
              <Text
                className='text-base text-dark dark:text-light'
                accessibilityLabel="bot message content">
              {item.content}
              </Text>

              {/* Chatbot Message TTS Button */}
              <Pressable 
                key={index}
                style={({ pressed }) => [
                  pressed ? { opacity: 0.7 } : {}, 
                  { 
                    ...styles.actions,
                    marginTop: 12,
                    margin: 4,
                    backgroundColor: isRecording 
                    ? "grey" // Background is grey when recording
                    : item.isTTSPlaying 
                      ? "red"  // Background is red when TTS is playing
                      : "green" // Default background is green
                  }
                ]}
                onPress={() => {
                  // Disable TTS while recording
                  if (!isRecording) {
                    toggleTTS();
                  } 
                }}
                disabled={isRecording}
                accessibilityRole="button"
                accessibilityLabel="bot message tts"> 
                {
                  (item.isTTSPlaying || isRecording) ? (
                    <MaterialCommunityIcons name="text-to-speech-off" size={24} color='#fff'/>
                  ) : (
                    <MaterialCommunityIcons name="text-to-speech" size={24} color='#fff'/>
                  )
                }
              </Pressable>
            </View>
          </View>
  
          {/* Recording Animation (only for the last message) */}
          {/* Determine if this is the last item} */}
          {index === messages.length - 1 && (
            <>
              {isRecording ? (
                  <View className="rounded-xl p-2 ml-20 mt-3 bg-orange-500 dark:bg-orange-600">
                    <Text className='text-base text-light'>Listening......</Text>
                  </View>
                ) : isRecordingSubmitting && (
                  <View className="rounded-xl p-2 ml-20 mt-3 bg-orange-500 dark:bg-orange-600">
                    <Text className='text-base text-light'>Translating...</Text>
                  </View>
                )}
            </>
          )}
        </>
      );
    } else if (item.author === "user") {
      // Patient Input
      return (
        <>
          {
            item.content.length == 0 ? (
              // System Message Bubble
              <View
                key={index}
                className="rounded-xl p-2 ml-14 mt-3 flex-row items-center w-10/12 flex justify-center bg-blue-700 dark:bg-blue-800"
                accessibilityLabel="system message bubble">
                <Text
                  className='text-base mr-2 text-gray-300'
                  accessibilityLabel="system message content"
                  >Invalid input. Please try again
                </Text>
                <MaterialIcons name="error" size={24} color='orange' style={{ marginTop: 1 }}/>
              </View>
            ) : (
              // Patient Message Bubble
              <View 
                key={index}
                className="rounded-xl p-2 ml-20 mt-3 bg-blue-500 dark:bg-blue-600"
                accessibilityLabel="user message bubble">
                <Text
                  className='text-base text-light'
                  accessibilityLabel="user message content"
                  >{item.content}</Text>
              </View>
            )
          }
        </>
      );
    } else {
      return (
        <></>
      )
    }
  };

  const startRecording = async () => {
    try {
      if ((username == undefined || sessionToken == undefined) || username.length == 0 || sessionToken.length == 0) {
        setErrorHeaderMessage("INVALID_USERNAME_SESSION")
        setErrorMessage("Invalid username and/or session token.")
        setErrorModalVisible(true);
      } 
      else {
        if (!permissionResponse || permissionResponse.status !== 'granted') {
          console.log('Requesting permission..');
          await requestPermission();
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix; If this option is set, your experience's audio interrupts audio from other apps.
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
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
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecordingAndSend = async () => {
    try {
      if (!username || !sessionToken || username.length === 0 || sessionToken.length === 0) {
        setErrorHeaderMessage("INVALID_USERNAME_SESSION");
        setErrorMessage("Invalid username and/or session token.");
        setErrorModalVisible(true);
        return;
      }
  
      if (recording) {
        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: true,
          interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
          shouldDuckAndroid: true, // Prevent audio from other apps to pause your audio
        });
  
        const recordingUri = recording.getURI();
        console.log('Recording stopped and stored at', recordingUri);
  
        if (recordingUri != null) {
          const recordingBlob = await FileSystem.readAsStringAsync(recordingUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Recording has stopped. Proceed to do transcription
          setIsRecording(false);
  
          const formData = new FormData();
          formData.append('audioFileData', recordingBlob);
          formData.append('audioFilePath', recordingUri);
          formData.append('username', username || '');
          formData.append('sessionToken', sessionToken || '');
          formData.append('taskSessionID', taskSessionID?.toString() || '');
  
          const controller = new AbortController();
          const timeout = 10000;
          const signal = controller.signal;
          const timeoutId = setTimeout(() => {
            controller.abort();
          }, timeout);
  
          setIsRecordingSubmitting(true);
  
          try {
            const response = await fetch('https://aphasia.mooo.com/api/patient/chat-session-audio', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
              signal: signal,
            });
  
            clearTimeout(timeoutId);
  
            const result = await response.json();
  
            if (response.ok) {
              console.log("transcription from backend:", result.data.transcription);
  
              const newMessages = [...messages];
              newMessages.push(
                { author: 'user', content: result.data.transcription },
                { author: 'bot', content: result.data.message }
              );
  
              setMessages(newMessages);
  
              // Display different message depending on patient's attempt
              if (result.data.completed && result.data.isCorrectAnswer) {
                setIsTaskCompleted("true");
                setSuccessHeaderMessage("Task Completed");
                setSuccessMessage("Good job! Thank you for attempting! Your session has been successfully recorded.");
                setSuccessModalVisible(true);
              }
              else if (result.data.completed && !result.data.isCorrectAnswer) {
                setIsTaskCompleted("true");
                setSuccessHeaderMessage("Task Completed");
                setSuccessMessage("Nice try! Thank you for attempting! Your session has been successfully recorded.");
                setSuccessModalVisible(true);
              }
            }
          } catch (error) {
            console.error('Error:', error);

            if (signal.aborted) {
              setErrorHeaderMessage("NETWORK REQUEST TIMED_OUT");
              setErrorMessage("The request has been aborted due to timeout.");
              setErrorModalVisible(true);
            } else if (error instanceof TypeError) {
              setErrorHeaderMessage("NETWORK REQUEST ERROR");
              setErrorMessage("There was a problem with the network request.");
              setErrorModalVisible(true);
            }
          } finally {
            setIsRecordingSubmitting(false);
          }
        }
      } else {
        console.log('No recording to stop');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };
  
  const clearRecording = async () => {
    try {
      if ((username == undefined || sessionToken == undefined) || username.length == 0 || sessionToken.length == 0) {
        setErrorHeaderMessage("INVALID_USERNAME_SESSION")
        setErrorMessage("Invalid username and/or session token.")
        setErrorModalVisible(true);
      } 
      else {
        if (recording) {
          console.log('Stopping recording..');
          await recording.stopAndUnloadAsync();
  
          const recordingUri = recording.getURI();
          console.log('Recording stopped and stored at', recordingUri);
  
          setRecording(undefined);
  
          setIsRecording(false);
        } else {
          console.log('No recording to stop');
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      console.log('Stopping Speech');
      Speech.stop(); // Stop the speech synthesis
  
      if (recording) {
        console.log('Unloading Sound');
        recording.stopAndUnloadAsync(); // Stop and unload the recording
      }
    };
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
      <SuccessModal 
        headerMessage={successHeaderMessage}
        successMessage={successMessage}
        modalVisible={successModalVisible}
        onDismiss={() => {
          setSuccessModalVisible(false);
        }}
      />
      <TaskDetailsModal
        name={taskName}
        description={taskDescription}
        status={isTaskCompleted}
        modalVisible={taskDetailsModalVisible}
        setModalVisible={setTaskDetailsModalVisible}
      />
      {
        messages.length >= 0 && wordRetrievalImageData != null ? (
          <View className="px-3 mb-6 flex-1">
            {/* Centered Container */}
            <View className="flex justify-center items-center w-full mt-3 my-3">
              {/* Chatbot Image Message Bubble */}
              <Pressable 
                className="p-2 flex rounded-2xl bg-gray-200 dark:bg-gray-600"
                onPress={() => {
                  setTaskDetailsModalVisible(true);
                }}
                accessibilityRole="image"
                accessibilityLabel="word retrieval task image">
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
              keyExtractor={(index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              keyboardShouldPersistTaps="handled" // Change this to handled
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true })
              }}
              scrollEventThrottle={16}
              scrollEnabled={scrollEnabled}
              contentContainerStyle={styles.flatListContent}
              ListFooterComponent={<View style={{height: 105}} pointerEvents="none"/>}
              style={{ 
                marginBottom: isTaskCompleted ? 25 : 0 // Whitespace of the bottom of the chat messages
              }} 
              refreshControl={
                // Disable refresh control at the start of the task when user first enter
                // or when task is already completed
                (messages.length > 0 && isTaskCompleted !== "true") ? (
                  <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  />
                ) : undefined
              }
              testID='chat-history-list'
            />
          </View>
      ) : (
        <View className='flex-1'></View>
      )}

      {isTaskCompleted === "null" && (
        <View className={`absolute bottom-0 left-0 right-0 justify-center items-center pt-1 ${Platform.OS === 'ios' ? 'pb-8' : 'pb-2'} bg-light dark:bg-dark`}>
          <Text className='text-sm font-medium text-dark dark:text-light'>{isRecording ? "Tap and submit your answer" : "Tap and say your answer"}</Text>
          {isRecording ? (
            <Pressable // Stop Recording Button
              style={({ pressed }) => [
                pressed ? { opacity: 0.5 } : {},
              ]}
              onPress={stopRecordingAndSend}
              accessibilityRole="button"
              accessibilityLabel="stop recording"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}>
              <Ionicons name="stop-circle-sharp" size={96} color={('#F44336')}/>
            </Pressable>
          ) : (
            <Pressable // Start Recording Button
              style={({ pressed }) => [
                pressed ? { opacity: 0.5 } : {},
              ]}
              disabled={
                // Disable clicking of recording button when submitting
                isRecordingSubmitting ? true : false
              }
              onPress={
                // Disable recording functionality being called when submitting
                isRecordingSubmitting ? null : startRecording
              }
              accessibilityRole="button"
              accessibilityLabel="start recording"
              accessibilityState={
                {
                  "disabled": false,
                }
              }
              accessible={true}>
              <Ionicons name="radio-button-on-sharp" size={96} color={
                isRecordingSubmitting ?
                'grey' : // Color grey when recording is not submitting
                '#F44336'  // Color red when recording is not submitting
              }/>
            </Pressable>
          )}
      
          {isRecording ? ( 
            <View className='absolute right-10'>
              <Pressable // Clear Recording Button
                style={({ pressed }) => [
                  pressed ? { opacity: 0.5 } : {},
                ]}
                onPress={clearRecording}
                accessibilityRole="button"
                accessibilityLabel="clear recording"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}>
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
    borderRadius: 100,
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