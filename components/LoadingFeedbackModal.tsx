import { Modal, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';

interface LoadingFeedbackModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const LoadingFeedbackModal: React.FC<LoadingFeedbackModalProps> = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {}}>
      <View style={styles.modalBody}>
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color="#bcbcbc" />
        <Text style={styles.loadingText}>Loading...</Text>
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

export default LoadingFeedbackModal;