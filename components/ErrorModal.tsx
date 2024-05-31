import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import React from 'react'
import { useState } from "react";

interface ErrorModalProps {
    headerMessage: string;
    errorMessage: string;
    modalVisible: boolean
    setModalVisible: (visible: boolean) => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ headerMessage, errorMessage, modalVisible, setModalVisible }) => {
    // Modal Header
    const modalHeader=(
        <View style={styles.modalHeader}>
          <Text style={styles.title}>{headerMessage}</Text>
          <View style={styles.divider}></View>
        </View>
    )

    // Modal Body
    const modalBody=(
        <View style={styles.modalBody}>
          <Text>{errorMessage}</Text>
        </View>
      )

    // Modal Footer
    const modalFooter=(
    <View style={styles.modalFooter}>
        <View style={styles.divider}></View>
        <View style={{flexDirection:"row-reverse",margin:10}}>
        <Pressable style={{...styles.actions,backgroundColor:"#db2828"}} 
            onPress={() => {
              setModalVisible(false)
            }}>
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
      width:"80%",
      borderRadius:5
    },
    modalHeader:{
      
    },
    title:{
      fontWeight:"bold",
      fontSize:20,
      padding:15,
      color:"#000"
    },
    divider:{
      width:"100%",
      height:1,
      backgroundColor:"lightgray"
    },
    modalBody:{
      backgroundColor:"#fff",
      paddingVertical:20,
      paddingHorizontal:10
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
  
  