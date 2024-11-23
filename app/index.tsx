import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors } from './colors';
import { Theme } from './theme';
import { Image } from 'react-native';

const App = ({navigation}) => {
  const [message, setMessage] = useState('');

  const go_to_chat = () => {
    // Here you can implement the logic for sending the message to the AI
    console.log('Message sent:', message);
    setMessage(''); // Reset input after sending

    // Navigate to the "chat" page
    window.location.href = './Chat'; // Adjust the URL if needed
};


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.input}
        onPress={go_to_chat}
      >
        <Text style={styles.input_text}>Send message to BranchBuddy...</Text>
      <TouchableOpacity onPress={go_to_chat}>
        <Image
          source={require('./assets/send_icon.png')}
          style={styles.send_message}
        ></Image>
      </TouchableOpacity>

    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: "black"
  },
  input: {
    height: 80,
    backgroundColor: Colors.primary,
    borderColor: 'gray',
    borderWidth: 0,
    marginBottom: 5,
    paddingLeft: 20,
    paddingRight: 70,
    color: "black",
    borderRadius: 15,
    fontFamily: Theme.fonts.bold,
    fontWeight: 600,
    fontSize: 20
  },
  input_text:{
    color: "black",
    paddingRight: 70,
    fontFamily: Theme.fonts.bold,
    fontWeight: 600,
    fontSize: 20,
    paddingTop: 15
  },
  send_message: {
    position: 'absolute',
    height: 30,
    width: 30,
    right: -30,
    bottom: 10
  }
});

export default App;
