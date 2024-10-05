import React, { useState } from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { MaterialIcons } from '@expo/vector-icons';

interface TaskFilterModalProps {
  headerMessage: string;
  taskFilterMessage: string;
  currentTaskCategoryValue: number;
  currentTaskStatusValue: number;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onConfirm: (categoryOfTask: number | null, statusOfTask: number | null) => void;
}

const TaskFilterModal: React.FC<TaskFilterModalProps> = ({ headerMessage, taskFilterMessage, currentTaskCategoryValue, currentTaskStatusValue, modalVisible, setModalVisible, onConfirm }) => {
    const [ isTaskCategoryOpen, setIsTaskCategoryOpen ] = useState(false);
    const [ selectedTaskCategoryValue, setSelectedTaskCategoryValue ] = useState('1');

    const [ isTaskStatusOpen, setIsTaskStatusOpen ] = useState(false);
    const [ selectedTaskStatusValue, setSelectedTaskStatusValue ] = useState('1');

    const taskCategoryItems = [
      {label: "Word Retrieval Task", value: "1"},

    ]

    const taskStatusItems = [
      {label: "All", value: "1"},
      {label: "Not started", value: "2"},
      {label: "In Progress", value: "3"},
      {label: "Completed", value: "4"}
    ]

    const convertStringToNumber = (inputString: string): number | null => {
      try {
        // Attempt to convert string to number
        const numberValue = Number(inputString); 
        if (isNaN(numberValue)) {
          // Throw an error if the result is NaN
          throw new Error("Invalid number");
        }
        return numberValue;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error converting string to number:", error.message);
        }
        return null;
      }
    };

    
    // Modal Header
    const modalHeader=(
      <View className='bg-blue-500' style={styles.modalHeader}>
        <View className='flex-row items-center'>
          <MaterialIcons name="filter-list" size={32} color='#fff'/>
          <Text style={styles.title}>{headerMessage}</Text>
        </View>
      </View>
    )

    // Modal Body
    const modalBody=(
      <View style={[styles.modalBody, (isTaskCategoryOpen && styles.openModalBody) || (isTaskStatusOpen && styles.openModalBodyTwo)]}>
        <Text className='text-lg mb-4'>{taskFilterMessage}</Text>
        <View style={styles.column}>
          {/* Task Type */}
          <View className='pb-3'>
            <DropDownPicker
              items={taskCategoryItems}
              open={isTaskCategoryOpen}
              setOpen={() => {
                  setIsTaskCategoryOpen(!isTaskCategoryOpen)
                  setIsTaskStatusOpen(false)
                }
              }
              value={selectedTaskCategoryValue}
              setValue={setSelectedTaskCategoryValue}
              placeholder='--Select Category of Task--'
              placeholderStyle={{color: 'grey', fontWeight: '500', fontSize: 14}}
              showArrowIcon={true}
              dropDownDirection='BOTTOM'
              disableBorderRadius={true}
              theme='LIGHT'
              maxHeight={200}
              autoScroll>
            </DropDownPicker>
          </View>

          {/* Task Status */}
          {/* - Hide this when the task category above is open  */}
          {
            !isTaskCategoryOpen && (
              <View className='pb-3'>
                <DropDownPicker
                  items={taskStatusItems}
                  open={isTaskStatusOpen}
                  setOpen={() => {
                      setIsTaskStatusOpen(!isTaskStatusOpen)
                      setIsTaskCategoryOpen(false)
                    }
                  }
                  value={selectedTaskStatusValue}
                  setValue={setSelectedTaskStatusValue}
                  placeholder='--Select Status of Task--'
                  placeholderStyle={{color: 'grey', fontWeight: '500', fontSize: 14}}
                  showArrowIcon={true}
                  dropDownDirection='BOTTOM'
                  disableBorderRadius={true}
                  theme='LIGHT'
                  maxHeight={200}
                  autoScroll>
                </DropDownPicker>
              </View>
            )
          }
        </View>
      </View>
    )

    // Modal Footer
    const modalFooter = (
      <View style={styles.modalFooter}>
        <View style={styles.divider}></View>
        <View style={{ flexDirection: "row-reverse", margin: 10 }}>
          <Pressable 
            style={({ pressed }) => [
              pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#858585"}
            ]}
            onPress={() => {
              setIsTaskCategoryOpen(false);
              setIsTaskStatusOpen(false);
              setModalVisible(false);
            }}>
            <Text className='text-base' style={styles.actionText}>Dismiss</Text>
          </Pressable>
          {(currentTaskCategoryValue.toString() !== selectedTaskCategoryValue || currentTaskStatusValue.toString() !== selectedTaskStatusValue) && (
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#0072B2"}
              ]}
              disabled={currentTaskCategoryValue.toString() === selectedTaskCategoryValue && currentTaskStatusValue.toString() === selectedTaskStatusValue}
              onPress={() => {
                const categoryValue = convertStringToNumber(selectedTaskCategoryValue);
                const statusValue = convertStringToNumber(selectedTaskStatusValue);
              
                // Check if both conversions are valid numbers and not null
                if (categoryValue !== null && !isNaN(categoryValue) && statusValue !== null && !isNaN(statusValue)) {
                  // If both are valid numbers, call onConfirm
                  onConfirm(categoryValue, statusValue);
                } else {
                  // Handle the case where conversion failed or null is encountered
                  console.warn("Invalid input: category or status is not a valid number.");
                }
              }}>
              <Text className='text-base' style={styles.actionText}>Confirm</Text>
            </Pressable>
          )}
        </View>
      </View>
    )

    // Wrap the components to form a modal
    const modalContainer=(
      <View style={styles.modalContainer}>
        {modalHeader}
        {modalBody}
        {modalFooter}
      </View>
    )

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.modal}>
          <View>
            {modalContainer}
          </View>
        </View>
      </Modal>
    );
}

export default TaskFilterModal

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal:{
      backgroundColor:"#00000099",
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16
    },
    modalContainer:{
      backgroundColor:"#f9fafb",
      width:"100%",
      borderRadius:5,
    },
    modalHeader:{
      paddingStart: 16,
      padding: 10
    },
    title:{
      fontWeight:"bold",
      fontSize:20,
      padding:15,
      color:"#fff",
      flexShrink: 1
    },
    divider:{
      width:"100%",
      height:1,
      backgroundColor:"lightgray"
    },
    modalBody:{
      backgroundColor:"#fff",
      paddingTop:20,
      paddingHorizontal:15
    },
    openModalBody:{
      backgroundColor:"#fff",
      paddingTop:20,
      paddingHorizontal:15,
      paddingBottom:120
    },
    openModalBodyTwo:{
      backgroundColor:"#fff",
      paddingTop:20,
      paddingHorizontal:15,
      paddingBottom:160
    },
    column: {
      paddingBottom: 15
    },
    picker: {
      height: 50,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'black',
    },
    modalFooter:{
      backgroundColor: 'white'
    },
    actions:{
      borderRadius:5,
      marginHorizontal:10,
      paddingVertical:10,
      paddingHorizontal:20
    },
    actionText:{
      color:"#fff"
    },
  });
  
  