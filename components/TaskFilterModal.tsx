import React, { useState } from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

interface TaskFilterModalProps {
  headerMessage: string;
  taskFilterMessage: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onConfirm: (categoryOfTask: number) => void;  
  onDismiss: () => void;
}

const TaskFilterModal: React.FC<TaskFilterModalProps> = ({ headerMessage, taskFilterMessage, modalVisible, onConfirm, onDismiss }) => {
    const [ categoryOfTask, setCategoryOfTask ] = useState(1); // Set default to word retrieval
    const [ statusOfTask, setStatusOfTask ] = useState(0);

    // Modal Header
    const modalHeader=(
      <View className='bg-blue-500' style={styles.modalHeader}>
        <View className='flex-row items-center'>
          <MaterialIcons name="assessment" size={32} color='#fff'/>
          <Text style={styles.title}>{headerMessage}</Text>
        </View>
      </View>
    )

    // Modal Body
    const modalBody=(
      <View style={styles.modalBody}>
        <Text className='text-lg mb-2'>{taskFilterMessage}</Text>
        <View style={styles.column}>
          {/* Task Type */}
          <Picker
            style={styles.picker}
            selectedValue={categoryOfTask}
            onValueChange={(itemValue, itemIndex) => {
              if (itemIndex !== 0) {
                setCategoryOfTask(itemValue);
              }
            }}>
            <Picker.Item label="--Select Category of Task--" value="" color="grey"/>
            <Picker.Item label="Word Retrieval Task" value="1" />
            <Picker.Item label="Sentence Retrieval Task" value="2" />
            <Picker.Item label="Article Reading Task" value="3" />
          </Picker>
          {/* Task Status */}
          <Picker
            style={styles.picker}
            selectedValue={statusOfTask}
            onValueChange={(itemValue, itemIndex) => {
              if (itemIndex !== 0) {
                setStatusOfTask(itemValue);
              }
            }}>
            <Picker.Item label="--Select Task Status--" value="" color="grey"/>
            <Picker.Item label="Not started" value="1" />
            <Picker.Item label="In Progress" value="2" />
            <Picker.Item label="Completed" value="3" />
          </Picker>
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
              onDismiss();
            }}>
            <Text className='text-base' style={styles.actionText}>Dismiss</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#0072B2"}
            ]}
            onPress={() => {
              onConfirm(categoryOfTask);
            }}>
            <Text className='text-base' style={styles.actionText}>Confirm</Text>
          </Pressable>
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
    },
    modalContainer:{
      backgroundColor:"#f9fafb",
      width:"100%",
      borderRadius:5
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
  
  