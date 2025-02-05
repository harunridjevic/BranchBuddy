import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Make sure to import deleteDoc and doc
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import NotesCard from './NotesCard';
import { Colors } from '../colors';

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
  id: string;
  name: string;
  contents: string;
  color: string;
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [noteName, setNoteName] = useState('');
  const [noteContents, setNoteContents] = useState('');
  const [noteColor, setNoteColor] = useState('#FFFFFF'); // Default color

  // Fetch notes from Firestore
  const fetchNotes = async () => {
    const notesCollection = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCollection);
    const notesList = notesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        contents: data.contents,
        color: data.color,
      };
    });
    setNotes(notesList);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!noteName || !noteContents) return; // Ensure both fields are filled
    const newNote = {
      name: noteName,
      contents: noteContents,
      color: noteColor,
    };
    const docRef = await addDoc(collection(db, 'notes'), newNote);
    setNotes((prevNotes) => [
      ...prevNotes,
      { id: docRef.id, ...newNote },
    ]);
    setShowModal(false);
    setNoteName('');
    setNoteContents('');
    setNoteColor('#FFFFFF'); // Reset to default color
  };

  const deleteNote = async (id: string) => {
    const noteToRemove = notes.find((note) => note.id === id);
    if (noteToRemove) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      await deleteDoc(doc(db, 'notes', id)); // Ensure deleteDoc and doc are properly imported
    }
  };

  const renderItem = ({ item }: { item: Note }) => (
    <NotesCard
      key={item.id}
      name={item.name}
      contents={item.contents}
      color={item.color}
      index={item.id}
      onDelete={() => deleteNote(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={notes}
      />

      {/* Add Note Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Custom Modal */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Note</Text>

            <TextInput
              placeholder="Note Name"
              style={styles.input}
              value={noteName}
              onChangeText={setNoteName}
            />
            <TextInput
              placeholder="Note Contents"
              style={[styles.input, styles.textArea]}
              value={noteContents}
              onChangeText={setNoteContents}
              multiline
            />

            <TextInput
              placeholder="Note Color (hex)"
              style={styles.input}
              value={noteColor}
              onChangeText={setNoteColor}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={addNote}>
                <Text style={styles.modalButtonText}>Add Note</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { width: '100%', flex: 1 },
  contentContainer: { padding: 10 },

  // Add Button (Circle)
  addButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.blue_color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 40,
    color: 'white',
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: Colors.blue_color,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Notes;
