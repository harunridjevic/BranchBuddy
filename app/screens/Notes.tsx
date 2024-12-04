import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import NotesCard from './NotesCard';

type Note = {
  id: number;
  text: string;
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: 'Note 1' },
    { id: 2, text: 'Note 2' },
    { id: 3, text: 'Note 3' },
    { id: 4, text: 'Note 4' },
    { id: 5, text: 'Note 5' },
  ]);

  // To delete a note
  const deleteNote = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // Render each note with animation
  const renderItem = ({ item }: { item: Note }) => (
    <NotesCard
      key={item.id}
      text={item.text}
      index={item.id}  // Pass the ID as index
      onDelete={() => deleteNote(item.id)}
    />
  );

  // Blank space component to be displayed at the bottom of the list
  const renderBlankSpace = () => (
    <View style={styles.blank_space}></View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={notes}
        ListFooterComponent={renderBlankSpace} // Add blank space at the bottom of the list
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make sure the parent container takes full space
  },
  scroll: {
    width: '100%',
    flex: 1, // Ensure the list takes up remaining space
  },
  contentContainer: {
    padding: 10,
  },
  blank_space: {
    width: '100%',
    height: 150, // You can adjust this to your desired size
  }
});

export default Notes;
