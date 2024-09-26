import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { router } from "expo-router";
import { Text, View, FlatList, ListRenderItem, StyleSheet, Pressable, RefreshControl } from "react-native";
import { FontAwesome5, FontAwesome6, Fontisto, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import ErrorModal from "../../components/ErrorModal";
import DialogModal from '../../components/DialogModal';
import TaskFilterModal from "../../components/TaskFilterModal";
import { useAuthContext } from '../../context/AuthContext';

type TaskFilterType = {
  categoryOfTask?: number;
  taskStatus?: number;
};

type TaskData = {
  word_retrieval_task: {
    taskID: string;
    imagePath: string;
    answer: string;
    inputRestriction: string
  };
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
  staff: {
    id: string;
    username: string;
    hashedPassword: string;
  };
  status: string;
  session: {
    taskSessionID: string;
    startedAt: Date;
    completedAt: Date | null;
  }
}

const Tasks: React.FC<TaskData> = () => {
  const { appUser } = useAuthContext();
  const [ username ] = useState(appUser?.username);
  const [ sessionToken ] = useState(appUser?.sessionToken);
  const { colorScheme } = useColorScheme();

  const [ isRetrieving, setRetrieving ] = useState(false);
  const [ isSubmitting, setSubmitting ] = useState(false);
  const [ dataStatusMessage, setDataStatusMessage ] = useState('')
  const [ isRefreshing, setRefreshing ] = useState(false);

  const [ errorModalVisible, setErrorModalVisible ] = useState(false);
  const [ errorHeaderMessage, setErrorHeaderMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ dialogModalVisible, setDialogModalVisible ] = useState(false);
  const [ dialogHeaderMessage, setDialogHeaderMessage ] = useState('');
  const [ dialogMessage, setDialogMessage ] = useState('');

  const [ tasks, setTasks ] = useState<TaskData[]>([]);
  const [ selectedTaskCategory, setSelectedTaskCategory ] = useState(1); // Default set to word retrieval
  const [ selectedTaskCategoryName, setSelectedTaskCategoryName ] = useState('Word Retrieval'); //
  const [ selectedTaskId, setSelectedTaskId ] = useState('');

  const [ taskFilterModalVisible, setTaskFilterModalVisible ] = useState(false);
  const [ taskFilterHeaderMessage, setTaskFilterHeaderMessage ] = useState('');
  const [ taskFilterMessage, setTaskFilterMessage ] = useState('');

  const maxTasks = 5; // Maximum number of tasks to keep in memory
  const flatListRef = useRef<FlatList<TaskData>>(null);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchAllTasks();
      setRefreshing(false);
    });
  }, []);

  const fetchAllTasks = async (additionalParams: TaskFilterType = {}) => {
    const controller = new AbortController();
    const timeout = 5000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    setRetrieving(true);

    try {
      setDataStatusMessage("Loading task data...")
      console.log("Session:", appUser?.sessionToken);

      if (appUser?.sessionToken == undefined) {
        // Introduce a 5-second delay before setting the error message to make user believe that fetching from api occurs
        setTimeout(() => {
          // Display error model
          setErrorHeaderMessage("SESSION DATA ERROR")
          setErrorMessage("There was a problem with the session data.")
          setErrorModalVisible(true);

          // Set error message
          setDataStatusMessage("An error has occurred.\nPlease refresh or try again later.");
          setRetrieving(false);

        }, timeout);
      }
      else {
        const params = new URLSearchParams();

        if (appUser?.username) {
          params.append('username', appUser.username);
        }
        if (appUser?.sessionToken) {
          params.append('sessionToken', appUser.sessionToken);
        }

        let response: Response;
        let jsonResponse: any;

        // Send GET request
        // Use ipconfig to find ip address of your pc in the local network
        // Determine the endpoint based on the presence of the wordRetrievalTask key
        if (additionalParams.categoryOfTask == 1) {
          setSelectedTaskCategory(1);
          setSelectedTaskCategoryName('Word Retrieval')
          setTaskFilterModalVisible(false);
          console.log(params.toString())

          response = await fetch(`https://aphasia.mooo.com/api/patient/get-word-retrieval-task?${params.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: signal
          });
          
          // Clear the timeout if the request is successful
          clearTimeout(timeoutId);

          jsonResponse = await response.json();
    
          if (response.ok) {
            setTasks(jsonResponse.data.tasks);
          } else {
            setDataStatusMessage("No word retrieval tasks found.");
          }
        } 
        else if (additionalParams.categoryOfTask == 2) {
          setSelectedTaskCategory(2);
          setSelectedTaskCategoryName('Sentence Retrieval')
          setTaskFilterModalVisible(false);

          response = await fetch(`https://aphasia.mooo.com/api/patient/get-sentence-retrieval-task?${params.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: signal
          });

          // Clear the timeout if the request is successful
          clearTimeout(timeoutId);

          jsonResponse = await response.json();
          
          if (response.ok) {
            setTasks(jsonResponse.data.tasks);
          } else {
            setDataStatusMessage("No sentence retrieval tasks found.");
          }
        } 
        else if (additionalParams.categoryOfTask == 3) {
          setSelectedTaskCategory(3);
          setSelectedTaskCategoryName('Article Reading')
          setTaskFilterModalVisible(false);

          response = await fetch(`https://aphasia.mooo.com/api/patient/get-article-reading-task?${params.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: signal
          });

          // Clear the timeout if the request is successful
          clearTimeout(timeoutId);

          jsonResponse = await response.json();
    
          if (response.ok) {
            setTasks(jsonResponse.data.tasks);
          } else {
            setDataStatusMessage("No article reading tasks found.");
          }
        }
        else { // Default gets word retrieval task
          response = await fetch(`https://aphasia.mooo.com/api/patient/get-word-retrieval-task?${params.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: signal
          });

          // Clear the timeout if the request is successful
          clearTimeout(timeoutId);

          jsonResponse = await response.json();
    
          if (response.ok) {
            setTasks(jsonResponse.data.tasks);
          } else {
            setDataStatusMessage("No word retrieval tasks found.");
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setDataStatusMessage("An error has occurred.\nPlease refresh or try again later.");
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
      setRetrieving(false);
    }
  }

  const createTaskSession = async () => {
    const controller = new AbortController();
    const timeout = 5000;
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    setDialogModalVisible(false);
    setSubmitting(true);

    if (selectedTaskCategory == null) {
      setErrorHeaderMessage("MISSING_INPUT")
      setErrorMessage("Please select a task category")
      setErrorModalVisible(true);
      setSubmitting(false);
    }
    else {
      if (selectedTaskCategory === 1) {
        try {
          // Send POST request for patient login
          // Use ipconfig to find ip address of your pc in the local network
          const response = await fetch('https://aphasia.mooo.com/api/patient/create-word-retrieval-task-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              sessionToken: sessionToken,
              taskID: selectedTaskId,
            }),
            signal: signal
          });
    
          // Clear the timeout if the request is successful
          clearTimeout(timeoutId);

          const jsonResponse = await response.json();
          
          // console.log('Confirmed with jsonResponse:', jsonResponse);
    
          if (response.ok) {
            // Clear data
            fetchAllTasks();

            // Redirect to chatbot page
            // router.push(`/chatbot/chatbot/sessionID:${jsonResponse.data.taskSessionID}`);

            router.push({
              pathname: "/chatbot/chatbot",
              params: {
                taskCategory: 1,
                filePath: tasks.find(task => task.task.id === selectedTaskId)?.word_retrieval_task.imagePath,
                taskSessionID: jsonResponse.data.taskSessionID,
                taskID: jsonResponse.data.taskID,
                completedAt: "null"
               }
            });

          } else {
            // Show error message
            setErrorHeaderMessage(jsonResponse.status);
            setErrorMessage(jsonResponse.message);
            setErrorModalVisible(true);
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
        
      } else if (selectedTaskCategory === 2) {

      } else if (selectedTaskCategory === 3) {

      } else {
        setErrorHeaderMessage("INVALID_INPUT")
        setErrorMessage("Please select a valid category of task.")
        setErrorModalVisible(true);
        setSubmitting(false);
      }
    }
  }

  const renderWordRetrievalTaskItem: ListRenderItem<TaskData> = ({ item, index }) => {
    return (
      <View key={index} className="flex-row mb-4">
        <View className="pl-1 pr-2 flex-1 bg-gray-200 dark:bg-gray-600 flex-row items-center">
          <View className="h-full w-2 bg-gray-400 mx-3"></View>
          <View className="ml-2 flex-1 py-3">
            <Text className='text-xl font-bold mb-2 text-dark dark:text-light'>{item.task.name}</Text>
              <View className='flex-row flex-1'>
                <FontAwesome5 name="search" size={16} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 8 }} />
                <Text className='text-sm mb-2 text-dark dark:text-light'>Word Retrieval</Text>
              </View>
            <View className='flex-row'>
              <Fontisto name="doctor" size={18} color={(colorScheme === 'dark' ? '#fff' : '#000')} style={{ marginRight: 10 }} />
              <Text className='text-sm mb-3 text-dark dark:text-light'>{item.staff.username}</Text>
            </View>
            <View className='absolute bottom-3 right-0'>
              {
                item.status === 'Completed' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#008000", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // Pass taskId to the chatbot page
                      router.push({
                        pathname: "/chatbot/chatbot",
                        params: {
                          taskCategory: 1,
                          filePath: item.word_retrieval_task.imagePath,
                          taskSessionID: item.session.taskSessionID,
                          taskID: item.task.id,
                          completedAt: "true"
                        }
                      });
                    }}>
                    <FontAwesome6 name="check-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.status}</Text>
                  </Pressable>
                  
                ) : item.status === 'In Progress' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#F3960F", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // Pass taskId to the chatbot page
                      router.push({
                        pathname: "/chatbot/chatbot",
                        params: {
                          taskCategory: 1,
                          filePath: item.word_retrieval_task.imagePath,
                          taskSessionID: item.session.taskSessionID,
                          taskID: item.task.id,
                          completedAt: "null"
                         }
                      });
                    }}>
                    <FontAwesome6 name="pause-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.status}</Text>
                  </Pressable>

                ) : item.status === 'Not Started' ? (
                  <Pressable
                    style={({ pressed }) => [
                      pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#858585", flexDirection: "row", alignItems: "center", padding: 10 }
                    ]}
                    onPress={() => {
                      // handle onPress
                      setSelectedTaskId(item.task.id);
                      setDialogHeaderMessage("Start Task");
                      setDialogMessage(`Are you sure you want to begin '${item.task.name}' task? Note that the time starts upon confirmation.`);
                      setDialogModalVisible(true);
                    }}>
                    <FontAwesome6 name="xmark-circle" size={18} color='#fff' style={{ marginRight: 8 }} />
                    <Text className='text-base' style={styles.actionText}>{item.status}</Text>
                  </Pressable>
                ) : (
                  <></>
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
        onConfirm={createTaskSession}
        onDismiss={() => setDialogModalVisible(false)}
      />
      <TaskFilterModal 
        headerMessage={taskFilterHeaderMessage}
        taskFilterMessage={taskFilterMessage}
        modalVisible={taskFilterModalVisible}
        setModalVisible={setTaskFilterModalVisible}
        onConfirm={(categoryOfTask) => {
          if (categoryOfTask !== null) {
            fetchAllTasks({ categoryOfTask });
          } else {
            console.warn("categoryOfTask is null. Fetching tasks skipped.");
          }
        }}
        onDismiss={() => setTaskFilterModalVisible(false)}
      />
      
      <View className='flex-row justify-center mb-6'>
        {
          tasks.length > 0 && isRetrieving == false && (
            <>
              <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#02A9E0", position: 'absolute', right: 0}
              ]}
              onPress={() => {
                // Filter Button
                setTaskFilterHeaderMessage("Filter Task")
                setTaskFilterMessage("Please filter the task to your liking.")
                setTaskFilterModalVisible(true);
              }}>
              <MaterialCommunityIcons name="filter-variant" size={24} color='#fff'/>
              </Pressable>
              <Text className='font-bold text-center text-2xl text-dark dark:text-light'>{selectedTaskCategoryName}</Text>
            </>
          )
        }
      </View>

      {
        tasks.length == 0 ? (
          <View className='flex-1 justify-center align-bottom items-center'>
            <Text className='font-bold text-xl mb-4 text-center text-dark dark:text-light'>{dataStatusMessage}</Text>
            {
              isRetrieving == false && (
                <Pressable
                  style={({ pressed }) => [
                    pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#02A9E0"}
                  ]}
                  onPress={() => {
                    // Refresh Button
                    fetchAllTasks();

                    // Set retrieving true
                    setRetrieving(true);
                  }}>
                  <View className='flex-row p-1'>
                    <SimpleLineIcons name="refresh" size={26} color='#fff' style={{ marginRight: 10 }} />
                    <Text className='text-lg' style={styles.actionText}>Refresh</Text>
                  </View>
                </Pressable>
              )
            }
          </View>
        ) : tasks.length > 0 && selectedTaskCategory == 1 ? (
          <FlatList
            data={tasks}
            renderItem={renderWordRetrievalTaskItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1} // Load more when 10% from the bottom
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            }
          />
        ) : tasks.length > 0 && selectedTaskCategory == 2 ? (
          <></>
        ) : tasks.length > 0 && selectedTaskCategory == 3 ? (
          <></>
        ) : (
          <></>
        )
      }
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
});