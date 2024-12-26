import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Modal, TextInput, Button, StatusBar, Animated } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import NotesCard from './NotesCard';
import {Colors} from '../colors'
// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "branchbuddy-8e817.firebaseapp.com",
  projectId: "branchbuddy-8e817",
  storageBucket: "branchbuddy-8e817.firebasestorage.app",
  messagingSenderId: "322380996428",
  appId: "1:322380996428:web:1e14d61f82a4cfe1cbb9e9",
  measurementId: "G-PNPKDBT443"
};

initializeApp(firebaseConfig);
const db = getFirestore();

type Note = {
  id: string;  // Changed to string to match Firestore document ID type
  text: string;
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]); // Start with an empty list
  const [modalVisible, setModalVisible] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [blurOpacity] = useState(new Animated.Value(0)); // For controlling blur opacity

  // To delete a note
  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // To add a new note and save it to Firestore
  const handleAddNote = async () => {
    if (newNoteText.trim()) {
      try {
        // Add new note to Firestore
        const docRef = await addDoc(collection(db, 'notes'), {
          text: newNoteText.trim(),
        });

        const newNote: Note = {
          id: docRef.id, // Firestore document ID is a string
          text: newNoteText.trim(),
        };

        setNotes((prevNotes) => [...prevNotes, newNote]);
        setNewNoteText('');
        setModalVisible(false);
      } catch (error) {
        console.error('Error adding note: ', error);
      }
    }
  };

  // Render each note with animation
  const renderItem = ({ item }: { item: Note }) => (
    <NotesCard
      key={item.id}
      text={item.text}
      index={item.id} // Pass the ID as index
      onDelete={() => deleteNote(item.id)}
    />
  );

  // Blank space component to be displayed at the bottom of the list
  const renderBlankSpace = () => <View style={styles.blank_space}></View>;

  // Toggle the blur animation
  const toggleBlurEffect = (isVisible: boolean) => {
    Animated.timing(blurOpacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    toggleBlurEffect(modalVisible); // Trigger blur effect when modal visibility changes
  }, [modalVisible]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={notes}
        ListFooterComponent={renderBlankSpace} // Add blank space at the bottom of the list
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Update StatusBar when modal is visible */}
      <StatusBar barStyle="light-content" backgroundColor={modalVisible ? '#333' : '#121212'} />

      {/* Create Note Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={() => setModalVisible(false)}>
        {/* Animated blur effect */}
        <Animated.View style={[styles.blurView, { opacity: blurOpacity }]} />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Note</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter note text"
              placeholderTextColor="#888"
              value={newNoteText}
              onChangeText={setNewNoteText}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#888" />
              <Button title="Add" onPress={handleAddNote} color="#00f" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Dark background for the main container
  },
  scroll: {
    width: '100%',
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  blank_space: {
    width: '100%',
    height: 150,
  },
  addButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: '#00f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333', // Dark background for modal
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Light color for modal text
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444', // Dark border color
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#fff', // Light color for input text
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
  },
});

export default Notes;
