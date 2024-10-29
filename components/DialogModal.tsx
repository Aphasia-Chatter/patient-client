import React from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DialogModalProps {
    headerMessage: string;
    dialogMessage: string;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    onConfirm: () => void;
    onDismiss: () => void;
}

const { width } = Dimensions.get('window');

const DialogModal: React.FC<DialogModalProps> = ({ headerMessage, dialogMessage, modalVisible, onConfirm, onDismiss }) => {
    // Modal Header
    const modalHeader=(
        <View className='bg-orange-600' style={styles.modalHeader}>
          <View className='flex-row items-center'>
            <MaterialIcons name="warning" size={36} color='#fff'/>
            <Text style={styles.title}>{headerMessage}</Text>
          </View>
        </View>
    )

    // Modal Body
    const modalBody=(
        <View style={styles.modalBody}>
          <Text className='text-base'>{dialogMessage}</Text>
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
              onPress={onDismiss}>
              <Text className='text-base' style={styles.actionText}>Dismiss</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed ? { opacity: 0.7 } : {}, {...styles.actions, backgroundColor:"#0072B2"}
              ]}
              onPress={onConfirm}>
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

export default DialogModal

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
  
  