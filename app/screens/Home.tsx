<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Colors } from '../colors';
import { Theme } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SeedScreen from './Seeds';
import NotesScreen from './Notes';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Login: undefined;
  Details: { id: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState(0); // Track selected button index
  const [fadeAnim] = useState(new Animated.Value(1)); // Shared animated value for fade effect
  const [activeScreen, setActiveScreen] = useState<React.ReactNode>(<SeedScreen />); // Render the current screen
  const [username, setUsername] = useState<string>(''); // State to hold the username

  const screens = [<SeedScreen />, <NotesScreen />]; // List of screens

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email || 'Guest'); // Use displayName, email, or 'Guest' as fallback
      } else {
        setUsername('Guest'); // Or navigate to login if no user is logged in
        navigation.navigate('Login'); // Automatically navigate to Login page
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [navigation]);

  const handleScreenChange = (index: number) => {
    if (index !== selectedButton) {
      // Change screen after fade-out animation
      setActiveScreen(screens[index]);
      setSelectedButton(index);
    }
  };

  const go_to_chat = () => {
    console.log('Message sent');
    navigation.navigate('Chat');
  };

  const go_to_login = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View>
        <Text style={[styles.text, { fontSize: 35, fontWeight: 'bold', margin: 20 }]}>
          Hello {username} {/* Display username */}
        </Text>
        <Text
          style={[styles.text, {
            fontSize: 19,
            fontWeight: 'bold',
            position: 'absolute',
            top: 55,
            left: 10,
            borderBottomWidth: 5,
            borderBottomColor: Colors.primary,
            margin: 10,
          }]}
        >
          20 Σ
        </Text>
        <TouchableOpacity style={styles.account_btn} onPress={go_to_login}>
          <Image
            source={require('../assets/account_icon.png')}
            style={styles.account_btn_icon}
          />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <ScrollView horizontal style={styles.scroll}>
        {['Seeds', 'Notes', 'Calendar', 'Chat'].map((item, index) => (
          <TouchableOpacity
            key={item}
            style={[styles.box, selectedButton === index && { backgroundColor: Colors.primary }]}
            onPress={() => handleScreenChange(index)}
          >
            <Text style={[styles.text, selectedButton === index && { color: Colors.secondary }]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Animated module screen */}
      <View style={styles.module_screen}>
        <Animated.View
          style={[styles.screenContainer, { opacity: fadeAnim }]}
        >
          {activeScreen}
        </Animated.View>
      </View>

      <View style={styles.bottom_bar}>
        <TouchableOpacity style={styles.input} onPress={go_to_chat}>
          <Text style={styles.input_text}>Send message to BranchBuddy...</Text>
          <Image
            source={require('../assets/send_icon.png')}
            style={styles.send_message}
          />
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  input: {
    height: 80,
    width: '96%',
    backgroundColor: Colors.primary,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20, // Adjust padding to ensure proper spacing
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row', // Align elements horizontally
    justifyContent: 'space-between', // Keep text on the left and button on the right
    alignItems: 'center', // Center elements vertically
  },
  input_text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 20,
    flex: 1, // Take up remaining space to push the send button to the right
  },
  send_button: {
    paddingRight: 10, // Add space to the right of the button if needed
  },
  send_message: {
    height: 30,
    width: 30,
  },

  text: {
    color: 'white',
  },
  account_btn: {
    position: 'absolute',
    marginTop: 40,
    right: 20,
    top: 0,
    width: 30,
    height: 30,
  },
  account_btn_icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  scroll: {
    padding: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
  box: {
    backgroundColor: Colors.secondary,
    marginTop: 25,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  module_screen: {
    position: 'absolute',
    top: 200,
    height: '80%',
    width: '100%',
  },
  screenContainer: {
    width: '100%',
    height: '100%',
  },
  bottom_bar: {
    backgroundColor: 'black',
    width: '100%',
    height: 100,
    marginBottom: -10,
  },
});

export default Home;
=======
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../colors';
import { Theme } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ChatScreen from './Chat'; // Import the Chat screen
import SeedScreen from './Seeds'

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Details: { id: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [selectedButton, setSelectedButton] = useState(0); // Track the selected button index

  const go_to_chat = () => {
    console.log('Message sent:', message);
    setMessage(''); // Reset input after sending
    navigation.navigate('Chat');
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View>
        <Text style={[styles.text, { fontSize: 35, fontWeight: 'bold', margin: 20 }]}>
          Hello Harun
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontSize: 19,
              fontWeight: 'bold',
              position: 'absolute',
              top: 55,
              left: 10,
              borderBottomWidth: 5,
              borderBottomColor: Colors.primary,
              margin: 10,
            },
          ]}
        >
          20 Σ
        </Text>

        <TouchableOpacity style={styles.account_btn}>
          <Image
            source={require('../assets/account_icon.png')}
            style={styles.account_btn_icon}
          />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <ScrollView horizontal style={styles.scroll}>
        {['Seeds', 'Notes', 'Calendar', 'Chat'].map((item, index) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.box,
              selectedButton === index && { backgroundColor: Colors.primary }, // Change background color when selected
            ]}
            onPress={() => setSelectedButton(index)} // Update selected button on press
          >
            <Text style={[styles.text, selectedButton === index && { color: Colors.secondary }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.module_screen}>
        <SeedScreen>

        </SeedScreen>
      </View>
      {/* Bottom bar */}
      <TouchableOpacity style={styles.input} onPress={go_to_chat}>
        <Text style={styles.input_text}>Send message to BranchBuddy...</Text>
        <TouchableOpacity onPress={go_to_chat}>
          <Image
            source={require('../assets/send_icon.png')}
            style={styles.send_message}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  input: {
    height: 80,
    width: '96%',
    backgroundColor: Colors.primary,
    borderColor: 'gray',
    borderWidth: 0,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 70,
    color: 'black',
    borderRadius: 15,
    fontFamily: Theme.fonts.bold,
    fontWeight: '600',
    fontSize: 20,
    position: 'absolute',
    bottom: 0,
  },
  input_text: {
    color: 'black',
    paddingRight: 70,
    fontFamily: Theme.fonts.bold,
    fontWeight: '600',
    fontSize: 20,
    paddingTop: 15,
  },
  send_message: {
    position: 'absolute',
    height: 30,
    width: 30,
    right: -30,
    bottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16, // Set a font size that works well for your buttons
  },
  account_btn: {
    position: 'absolute',
    marginRight: 31,
    marginTop: 40,
    right: 0,
    top: 0,
    width: 30,
    height: 30,
  },
  account_btn_icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  scroll: {
    padding: 10,
    flexDirection: 'row', // Ensure horizontal scroll
    marginBottom: 10, // Avoid pushing other elements too far down
  },
  box: {
    backgroundColor: Colors.secondary,
    marginTop: 25,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    height: 50,
    width: 120,
    justifyContent: 'center', // Vertically center the text
    alignItems: 'center', // Horizontally center the text
  },
  module_screen: {
    position: 'absolute',
    top: 200,
    height: '80%',
    width: '100%'
  }
});


export default Home;
>>>>>>> 6ce4109ac8569b5fc5d77a90253a84a1b499ee38
=======
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../colors';
import { Theme } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ChatScreen from './Chat'; // Import the Chat screen
import SeedScreen from './Seeds'

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Details: { id: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [selectedButton, setSelectedButton] = useState(0); // Track the selected button index

  const go_to_chat = () => {
    console.log('Message sent:', message);
    setMessage(''); // Reset input after sending
    navigation.navigate('Chat');
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View>
        <Text style={[styles.text, { fontSize: 35, fontWeight: 'bold', margin: 20 }]}>
          Hello Harun
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontSize: 19,
              fontWeight: 'bold',
              position: 'absolute',
              top: 55,
              left: 10,
              borderBottomWidth: 5,
              borderBottomColor: Colors.primary,
              margin: 10,
            },
          ]}
        >
          20 Σ
        </Text>

        <TouchableOpacity style={styles.account_btn}>
          <Image
            source={require('../assets/account_icon.png')}
            style={styles.account_btn_icon}
          />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <ScrollView horizontal style={styles.scroll}>
        {['Seeds', 'Notes', 'Calendar', 'Chat'].map((item, index) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.box,
              selectedButton === index && { backgroundColor: Colors.primary }, // Change background color when selected
            ]}
            onPress={() => setSelectedButton(index)} // Update selected button on press
          >
            <Text style={[styles.text, selectedButton === index && { color: Colors.secondary }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.module_screen}>
        <SeedScreen>

        </SeedScreen>
      </View>
      {/* Bottom bar */}
      <TouchableOpacity style={styles.input} onPress={go_to_chat}>
        <Text style={styles.input_text}>Send message to BranchBuddy...</Text>
        <TouchableOpacity onPress={go_to_chat}>
          <Image
            source={require('../assets/send_icon.png')}
            style={styles.send_message}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  input: {
    height: 80,
    width: '96%',
    backgroundColor: Colors.primary,
    borderColor: 'gray',
    borderWidth: 0,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 70,
    color: 'black',
    borderRadius: 15,
    fontFamily: Theme.fonts.bold,
    fontWeight: '600',
    fontSize: 20,
    position: 'absolute',
    bottom: 0,
  },
  input_text: {
    color: 'black',
    paddingRight: 70,
    fontFamily: Theme.fonts.bold,
    fontWeight: '600',
    fontSize: 20,
    paddingTop: 15,
  },
  send_message: {
    position: 'absolute',
    height: 30,
    width: 30,
    right: -30,
    bottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16, // Set a font size that works well for your buttons
  },
  account_btn: {
    position: 'absolute',
    marginRight: 31,
    marginTop: 40,
    right: 0,
    top: 0,
    width: 30,
    height: 30,
  },
  account_btn_icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  scroll: {
    padding: 10,
    flexDirection: 'row', // Ensure horizontal scroll
    marginBottom: 10, // Avoid pushing other elements too far down
  },
  box: {
    backgroundColor: Colors.secondary,
    marginTop: 25,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    height: 50,
    width: 120,
    justifyContent: 'center', // Vertically center the text
    alignItems: 'center', // Horizontally center the text
  },
  module_screen: {
    position: 'absolute',
    top: 200,
    height: '80%',
    width: '100%'
  }
});


export default Home;
>>>>>>> 6ce4109ac8569b5fc5d77a90253a84a1b499ee38
