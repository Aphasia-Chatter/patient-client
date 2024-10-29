import React from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorModalProps {
    headerMessage: string;
    errorMessage: string;
    modalVisible: boolean
    setModalVisible: (visible: boolean) => void;
}

const { width } = Dimensions.get('window');

const ErrorModal: React.FC<ErrorModalProps> = ({ headerMessage, errorMessage, modalVisible, setModalVisible }) => {
    // Modal Header
    const modalHeader=(
      <View className='bg-red-600' style={styles.modalHeader}>
        <View className='flex-row items-center'>
          <MaterialIcons name="error" size={36} color='#fff'/>
          <Text style={styles.title}>{headerMessage}</Text>
        </View>
      </View>
    )

    // Modal Body
    const modalBody=(
        <View style={styles.modalBody}>
          <Text className='text-base'>{errorMessage}</Text>
        </View>
      )

    // Modal Footer
    const modalFooter=(
    <View style={styles.modalFooter}>
        <View style={styles.divider}></View>
        <View style={{flexDirection:"row-reverse", margin:10}}>
        <Pressable
          style={({ pressed }) => [
            pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#858585"}
          ]}
          onPress={() => {
            setModalVisible(false)
          }}>
          <Text className='text-base' style={styles.actionText}>Dismiss</Text>
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

export default ErrorModal

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
      width: width * 0.8,
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
      paddingVertical:20,
      paddingHorizontal:15
    },
    modalFooter:{
    },
    actions:{
      borderRadius:5,
      marginHorizontal:10,
      paddingVertical:10,
      paddingHorizontal:20
    },
    actionText:{
      color:"#fff"
    }
  });
  
  