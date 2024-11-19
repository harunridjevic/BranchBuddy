import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import Chat from './Chat'; // Import the Chat screen

const App = () => {
  const [showChat, setShowChat] = useState(false); // State to toggle between screens

  return (
    <View style={styles.container}>
      {!showChat ? (
        // Home screen with a link to Chat
        <View>
          <Text style={styles.welcomeText}>Welcome to the App!</Text>
          <Button
            title="Go to Chat"
            onPress={() => setShowChat(true)} // Navigate to Chat
          />
        </View>
      ) : (
        // Chat screen
        <Chat />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
