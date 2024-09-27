import { Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface TaskDetailsModalProps {
  headerMessage: string;
  name: string;
  description: string;
  status: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  headerMessage,
  modalVisible,
  name,
  description,
  status,
}) => {
  const [nameOfTask, setNameOfTask] = useState(name);
  const [descriptionOfTask, setDescriptionOfTask] = useState(description);
  const [statusOfTask, setStatusOfTask] = useState(description);

  useEffect(() => {
    setNameOfTask(name);
    setDescriptionOfTask(description);
    setStatusOfTask(status);
  }, [name, description, status]);

  // Modal Header
  const modalHeader = (
    <View className="bg-orange-600" style={styles.modalHeader}>
      <View className="flex-row items-center">
        <MaterialIcons name="assessment" size={32} color="#fff" />
        <Text style={styles.title}>{headerMessage}</Text>
      </View>
    </View>
  );

  // Modal Body
  const modalBody = (
    <View style={styles.modalBody}>
      <Text className="text-lg mb-2">{nameOfTask}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          {/* Name of Task */}
          <TextInput
            style={styles.textInput}
            placeholder="Name of Task"
            placeholderTextColor="gray"
            value={nameOfTask}
            onChangeText={setNameOfTask}
            autoFocus={true}
          />
          {/* Description of Task*/}
          <TextInput
            style={styles.textInput}
            placeholder="Description Of Task"
            placeholderTextColor="gray"
            value={descriptionOfTask}
            onChangeText={setDescriptionOfTask}
          />
          {/* Status of Task*/}
          <TextInput
            style={styles.textInput}
            placeholder="Status Of Task"
            placeholderTextColor="gray"
            value={statusOfTask}
            onChangeText={setStatusOfTask}
          />
        </View>
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
            setNameOfTask("");
            setDescriptionOfTask("");
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "100%",
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
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
  columnTwo: {
    marginLeft: 16,
    marginBottom: 32,
  },
  rowTwo: {
    flex: 1,
    marginTop: 25,
  },
  textInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    paddingStart: 10,
  },
  modalFooter: {},
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: "#fff",
  },
});
