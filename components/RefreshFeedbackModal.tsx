import { Alert, Modal, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';

interface RefreshFeedbackModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const RefreshFeedbackModal: React.FC<RefreshFeedbackModalProps> = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.modalBody}>
        <ActivityIndicator size="large" color="#bcbcbc" />
        <Text style={styles.loadingText}>Refreshing data...</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    color: '#bcbcbc',
  },
});

export default RefreshFeedbackModal;