import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, TextInput, Animated } from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, updateDoc, increment } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NotesCard from './NotesCard';
import { Colors } from '../colors';

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

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

type Note = {
  id: string;
  name: string;
  contents: string;
  color: string;
  userId: string;
  createdAt: string; // Change to string to store date in dd mm yyyy format
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [noteName, setNoteName] = useState('');
  const [noteContents, setNoteContents] = useState('');
  const [noteColor, setNoteColor] = useState('');
  const [user, setUser ] = useState(auth.currentUser );
  const [cardAnimation] = useState(new Animated.Value(0)); // Animation for notes loading
  const [modalAnimation] = useState(new Animated.Value(0)); // Animation for modal

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      if (currentUser ) {
        setUser (currentUser );
        fetchNotes(currentUser .uid);
      } else {
        setUser (null);
        setNotes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchNotes = async (userId: string) => {
    try {
      const notesQuery = query(
        collection(db, 'notes'),
        where("userId", "==", userId),
        orderBy("createdAt", "desc") // Order by createdAt to show the most recent notes first
      );
      const notesSnapshot = await getDocs(notesQuery);
      const notesList = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt, // Keep it as a string
      }) as Note);
      setNotes(notesList);
      // Trigger zoom-in animation for the notes
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!noteName.trim() || !noteContents.trim() || !user) return;
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
      const newNote = {
        name: noteName.trim(),
        contents: noteContents.trim(),
        color: noteColor || 'white',
        userId: user.uid,
        createdAt: formattedDate, // Store date as a string in dd/mm/yyyy format
      };

      // Add the new note to the notes collection
      const docRef = await addDoc(collection(db, 'notes'), newNote);

      // Increment the seedCoin for the current user
      const userRef = doc(db, 'users', user.uid); // Get the user's document reference
      await updateDoc(userRef, {
        seedCoins: increment(1) // Increment seedCoin by 1
      });

      // Update the local state with the new note
      setNotes((prevNotes) => [
        { id: docRef.id, ...newNote },
        ...prevNotes,
      ]);

      // Reset the modal and input fields
      setShowModal(false);
      setNoteName('');
      setNoteContents('');
      setNoteColor('');
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
    // Zoom in animation for the modal
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    // Zoom out animation for the modal
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false); // Close the modal after the animation
    });
  };

  // Component for the empty rectangle
  const EmptyRectangle = () => (
    <View style={styles.emptyRectangle}>
      <Text style={styles.emptyText}>Add a new note!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Conditionally render the "No notes available." text */}
      {notes.length === 0 && (
        <Text style={styles.noNoteText}>No notes available.</Text>
      )}

      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        data={notes} // Use only the notes array
        renderItem={({ item, index }) =>
          <Animated.View style={{ opacity: cardAnimation, transform: [{ scale: cardAnimation }] }}>
            <NotesCard
              key={item.id}
              index={index}
              name={item.name}
              contents={item.contents}
              color={item.color}
              createdAt={item.createdAt}
              onDelete={() => deleteNote(item.id)}
            />
          </Animated.View>
        }
        keyExtractor={(item) => item.id}
        ListFooterComponent={<EmptyRectangle />} // Add the empty rectangle as the footer
      />

      {/* Conditionally render the Add Note button */}
      {!showModal && (
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {showModal && (
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: modalAnimation }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Note</Text>
            <TextInput placeholder="Note Name" placeholderTextColor="#fff" style={styles.input} value={noteName} onChangeText={setNoteName} />
            <TextInput placeholder="Note Contents" placeholderTextColor="#fff" style={[styles.input, styles.textArea]} value={noteContents} onChangeText={setNoteContents} multiline />
            <View style={styles.colorButtons}>
              <Text style={styles.colorsText}>Colors:</Text>
              {[Colors.blue_color, Colors.yellow_color, Colors.green_color, Colors.red_color].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorButton, { backgroundColor: color }]}
                  onPress={() => setNoteColor(color)}
                >
                  {noteColor === color && (
                    <Text style={styles.checkmark}>✔</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={addNote}>
              <Text style={styles.modalButtonText}>Add Note</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  noNoteText: {
    color: Colors.secondary,
    fontSize: 20,
    position: 'absolute', // Position it in the center
    top: '33%',
    transform: [{ translateY: -12 }], // Adjust for half the font size to center vertically
  },
  scroll: { width: '100%', flex: 1, marginTop: -10 },
  contentContainer: { padding: 10 },
  addButton: {
    position: 'absolute',
    bottom: 136,
    right: 20,
    width: 75,
    height: 75,
    borderRadius: 60,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensure it's above other elements
  },
  addButtonText: { fontSize: 40, color: 'white' },
  modalOverlay: {
    position: 'absolute',
    top: -200, // Changed to 0 to cover the entire screen
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '101%',
    zIndex: 5, // Ensure the modal overlay is behind the button
  },
  modalContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    color: 'white',
    borderWidth: 5,
    borderColor: Colors.primary,
    zIndex: 10, // Ensure modal content stays on top of the overlay
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    color: 'white'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  colorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  colorButton: { width: 40, height: 40, borderRadius: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  cancelButton: { backgroundColor: 'gray' },
  modalButtonText: { color: 'black', fontWeight: 'bold' },
  emptyRectangle: {
    height: 200, // You can change this to any color you want
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyText: {
    color: 'black',
    fontSize: 18,
  },
  colorsText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 7,
    paddingLeft: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'transparent',
    padding: 5,
    zIndex: 15, // Ensure the close button stays on top of the modal
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 10,
    color: 'black',
    fontSize: 18,
  },
});

export default Notes;