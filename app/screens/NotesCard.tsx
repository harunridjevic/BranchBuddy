import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../colors';

interface NotesCardProps {
  text: string;         // Text to display
  onDelete: () => void; // Function to handle delete action
  index: number;        // Index of the note (for identifying position)
}

const NotesCard: React.FC<NotesCardProps> = ({ text, onDelete, index }) => {
  const [scale] = useState(new Animated.Value(1)); // Create a scale animation
  const [opacity] = useState(new Animated.Value(1)); // Create an opacity animation
  const [isDeleted, setIsDeleted] = useState(false);

  // Trigger the burst animation on delete
  const handleDelete = () => {
    // Animate scale and opacity to create the burst effect
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.5, useNativeDriver: true }), // Scale up
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }), // Fade out
      ]),
      Animated.spring(scale, { toValue: 0, useNativeDriver: true }), // Shrink to 0
    ]).start(() => {
      // Set deleted state to true after animation ends
      setIsDeleted(true);
      onDelete(); // Call onDelete function passed from parent
    });
  };

  if (isDeleted) return null; // Return null when the card is deleted

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale }], opacity: opacity }, // Apply scale and opacity animations
      ]}
    >
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity style={styles.delete} onPress={handleDelete}>
        <Image
          source={require('../assets/trash.png')} // Replace with your actual image path
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    marginLeft: 15,
    marginTop: 20,
    height: 170,
    borderRadius: 20,
    overflow: 'hidden', // Ensures the content stays inside the rounded corners
    position: 'relative', // Allow absolute positioning of the image
    backgroundColor: Colors.blue_color,
  },
  text: {
    color: 'black',
    fontSize: 18,
    margin: 20,
  },
  delete: {
    width: 50,
    height: 50,
    backgroundColor: Colors.blue_color_secondary,
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0,
    borderRadius: 10,
    justifyContent: 'center', // Center the image inside
    alignItems: 'center',
  },
  deleteIcon: {
    width: 25, // Adjust the size of the image
    height: 25, // Adjust the size of the image
    resizeMode: 'contain', // Ensure the image fits within the bounds
  },
});

export default NotesCard;
