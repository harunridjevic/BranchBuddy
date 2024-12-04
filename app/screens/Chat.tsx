<<<<<<< HEAD
<<<<<<< HEAD
// Chat.tsx
import React, { useState } from 'react';
import { StatusBar, View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors } from '../colors';
import { Theme } from '../theme';
import { Image } from 'react-native';

const Chat = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Here you can implement the logic for sending the message to the AI
    console.log('Message sent:', message);
    setMessage(''); // Reset input after sending
  };

  return (
    <View style={styles.container}>
     <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Talk to BranchBuddy..."
      />

      <TouchableOpacity onPress={handleSend}>
        <Image
          source={require('../assets/send_icon.png')}
          style={styles.send_message}
        ></Image>
      </TouchableOpacity>

      {/* Displaying chat messages could be implemented here */}
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
    height: 60,
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
  send_message: {
    position: 'absolute',
    height: 30,
    width: 30,
    right: 20,
    bottom: 19
  }
});

export default Chat;
=======
// Chat.tsx
import React, { useState } from 'react';
import { StatusBar, View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors } from '../colors';
import { Theme } from '../theme';
import { Image } from 'react-native';

const Chat = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Here you can implement the logic for sending the message to the AI
    console.log('Message sent:', message);
    setMessage(''); // Reset input after sending
  };

  return (
    <View style={styles.container}>
     <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Talk to BranchBuddy..."
      />

      <TouchableOpacity onPress={handleSend}>
        <Image
          source={require('../assets/send_icon.png')}
          style={styles.send_message}
        ></Image>
      </TouchableOpacity>

      {/* Displaying chat messages could be implemented here */}
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
    height: 60,
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
  send_message: {
    position: 'absolute',
    height: 30,
    width: 30,
    right: 20,
    bottom: 19
  }
});

export default Chat;
>>>>>>> 6ce4109ac8569b5fc5d77a90253a84a1b499ee38
=======
// Chat.tsx
import React, { useState } from 'react';
import { StatusBar, View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors } from '../colors';
import { Theme } from '../theme';
import { Image } from 'react-native';

const Chat = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Here you can implement the logic for sending the message to the AI
    console.log('Message sent:', message);
    setMessage(''); // Reset input after sending
  };

  return (
    <View style={styles.container}>
     <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Talk to BranchBuddy..."
      />

      <TouchableOpacity onPress={handleSend}>
        <Image
          source={require('../assets/send_icon.png')}
          style={styles.send_message}
        ></Image>
      </TouchableOpacity>

      {/* Displaying chat messages could be implemented here */}
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
    height: 60,
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
  send_message: {
    position: 'absolute',
    height: 30,
    width: 30,
    right: 20,
    bottom: 19
  }
});

export default Chat;
>>>>>>> 6ce4109ac8569b5fc5d77a90253a84a1b499ee38
