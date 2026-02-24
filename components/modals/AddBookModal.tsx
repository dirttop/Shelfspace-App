import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onScan: () => void;
  onSearch: () => void;
}

export default function AddBookModal({
  visible,
  onClose,
  onScan,
  onSearch,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add a Book</Text>
          <Pressable style={[styles.button, styles.scan]} onPress={onScan}>
            <Text style={styles.buttonText}>Scan Book</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.search]} onPress={onSearch}>
            <Text style={[styles.buttonText, { color: "#2563eb" }]}>
              Search Book
            </Text>
          </Pressable>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  scan: {
    backgroundColor: "#2563eb",
  },
  search: {
    backgroundColor: "#e0e7ff",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  close: {
    marginTop: 8,
    padding: 8,
  },
  closeText: {
    color: "#64748b",
    fontSize: 16,
  },
});
