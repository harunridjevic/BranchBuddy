import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../colors';

interface NotesCardProps {
  name: string;
  contents: string;
  color: string;
  onDelete: () => void;
  index: number;
  createdAt: string;  // Add createdAt to store the note creation date
}

const NotesCard: React.FC<NotesCardProps> = ({ name, contents, color, onDelete, index, createdAt }) => {
  const [scale] = useState(new Animated.Value(1));
  const [opacity] = useState(new Animated.Value(1));
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getDeleteButtonColor = (color: string) => {
    switch (color) {
      case Colors.blue_color:
        return Colors.blue_color_secondary;
      case Colors.red_color:
        return Colors.red_color_secondary;
      case Colors.green_color:
        return Colors.green_color_secondary;
      default:
        return Colors.yellow_color_secondary;
    }
  };

  const handleDelete = () => {
    setIsAnimating(true); // Mark animation start
    Animated.sequence([  
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      Animated.spring(scale, { toValue: 0, useNativeDriver: true }),
    ]).start(() => {
      setIsDeleted(true);
      onDelete();
    });
  };

  if (isDeleted) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: color,
          transform: [{ scale }],
          opacity: opacity,
          position: isAnimating ? 'absolute' : 'relative',
        },
      ]}
    >
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.contents}>{contents}</Text>
      <Text style={styles.date}>{`Created on: ${createdAt ? createdAt.toLocaleString() : ''}`}</Text>

      <TouchableOpacity
        style={[styles.delete, { backgroundColor: getDeleteButtonColor(color) }]}
        onPress={handleDelete}
      >
        <Image source={require('../../assets/images/trash.png')} style={styles.deleteIcon} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    marginLeft: 15,
    marginBottom: 20,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
  },
  name: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
  },
  contents: {
    color: 'black',
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  date: {
    color: 'black',
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 10,
  },
  delete: {
    width: 50,
    height: 50,
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default NotesCard;
