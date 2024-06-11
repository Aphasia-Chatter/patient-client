import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';

interface SuccessModalProps {
    headerMessage: string;
    successMessage: string;
    modalVisible: boolean;
    onDismiss: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ headerMessage, successMessage, modalVisible, onDismiss }) => {
    // Modal Header
    const modalHeader=(
        <View className='bg-green-500' style={styles.modalHeader}>
          <View className='flex-row items-center'>
            <MaterialIcons name="check-circle" size={36} color='#fff'/>
            <Text style={styles.title}>{headerMessage}</Text>
          </View>
        </View>
    )

    // Modal Body
    const modalBody=(
        <View style={styles.modalBody}>
          <Text>{successMessage}</Text>
        </View>
      )

    // Modal Footer
    const modalFooter=(
    <View style={styles.modalFooter}>
        <View style={styles.divider}></View>
        <View style={{flexDirection:"row-reverse", margin:10}}>
        <Pressable style={{...styles.actions,backgroundColor:"#949494"}} 
            onPress={onDismiss}>
            <Text style={styles.actionText}>Dimiss</Text>
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

export default SuccessModal

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
      width:"80%",
      borderRadius:5
    },
    modalHeader:{
      paddingStart: 12
    },
    title:{
      fontWeight:"bold",
      fontSize:20,
      padding:15,
      color:"#fff"
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
  
  