import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TaskDetailsModalProps {
  name: string;
  description: string;
  status: string | string[];
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const { width, height } = Dimensions.get('window');

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ name, description, status, modalVisible, setModalVisible}) => {
  const [nameOfTask, setNameOfTask] = useState(name);
  const [descriptionOfTask, setDescriptionOfTask] = useState(description);
  const [statusOfTask, setStatusOfTask] = useState(description);

  useEffect(() => {
    setNameOfTask(name);
    setDescriptionOfTask(description);

    if (status === "null" || status === "false") {
      setStatusOfTask("In Progress");
    } else if (status === "true") {
      setStatusOfTask("Completed");
    }

  }, [name, description, status]);

  // Modal Header
  const modalHeader = (
    <View className="bg-blue-500" style={styles.modalHeader}>
      <View className="flex-row items-center">
        <MaterialIcons name="info" size={32} color="#fff" />
        <Text style={styles.title}>Task Details</Text>
      </View>
    </View>
  );

  // Modal Body
  const modalBody = (
    <View style={styles.modalBody}>
      {/* Task Details Section */}
      <View style={styles.section}>
        {/* Name of Task */}
        <Text style={styles.label}>Name</Text>
        <Text style={styles.text}>{nameOfTask}</Text>
      </View>
  
      {/* Description of Task */}
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.text}>{descriptionOfTask}</Text>
      </View>
  
      {/* Status of Task */}
      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.text}>{statusOfTask}</Text>
      </View>
    </View>
  );

  // Modal Footer
  const modalFooter = (
    <View style={styles.modalFooter}>
      <View style={styles.divider}></View>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        {/* Dismiss Button */}
        <Pressable
          style={({ pressed }) => [
            pressed ? { opacity: 0.7 } : {},
            { ...styles.actions, backgroundColor: "#858585" },
          ]}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Text className="text-base" style={styles.actionText}>
            Dismiss
          </Text>
        </Pressable>
      </View>
    </View>
  );

  // Wrap the components to form a modal
  const modalContainer = (
    <View style={styles.modalContainer}>
      {modalHeader}
      {modalBody}
      {modalFooter}
    </View>
  );

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modal}>
          <View>{modalContainer}</View>
        </View>
      </Modal>
    </>
  );
};

export default TaskDetailsModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: height * 0.25,
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: width * 0.8, // Set both width and height to 80% of the screen width
    height: width * 0.8, // Ensuring it's square
    borderRadius: 5,
  },
  modalHeader: {
    paddingStart: 16,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#fff",
    flexShrink: 1,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalBody: {
    backgroundColor: "#fff",
    padding: 15,
  },
  modalFooter: {
    backgroundColor: 'white'
  },
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: "#fff",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
});
