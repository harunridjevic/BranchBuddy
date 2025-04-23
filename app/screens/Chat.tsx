import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  AppState,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../colors';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [screenHeight, setScreenHeight] = useState<number>(Dimensions.get('window').height);
  const scrollViewRef = useRef<ScrollView>(null); // Reference for ScrollView

  // Detect screen height changes (to detect virtual keyboard visibility)
  useEffect(() => {
    const onDimensionsChange = () => {
      setScreenHeight(Dimensions.get('window').height);
    };

    const subscription = Dimensions.addEventListener('change', onDimensionsChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Adjust the input container when the keyboard shows or hides
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        if (screenHeight - e.endCoordinates.height < screenHeight * 0.9) {
          setIsKeyboardVisible(true);
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [screenHeight]);

  // Load conversation history from AsyncStorage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('chatHistory');
        if (storedHistory) {
          setConversationHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    };
    loadHistory();
  }, []);

  // Save conversation history to AsyncStorage
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
      } catch (error) {
        console.error('Failed to save conversation history:', error);
      }
    };
    saveHistory();
  }, [conversationHistory]);

  // Clear conversation history when the app goes to the background
  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        // Clear conversation history when app goes to background
        setConversationHistory([]);
        AsyncStorage.removeItem('chatHistory');
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    setLoading(true);
    try {
      const updatedHistory: Message[] = [
        ...conversationHistory,
        { role: 'user', text: message },
      ];
      setConversationHistory(updatedHistory);
      scrollToBottom(); // Scroll to the bottom after updating messages

      const personalityInstructions = "You are named BranchBuddy, an AI with a friendly and motivational personality. You should be supportive but realistic. The messages should be short. Also, talk as human like as possible and use slang. Respond to this message sent by the user: ";

      const prompt = `${personalityInstructions}\n` + updatedHistory
        .map((entry) => {
          return entry.role === 'user' ? `${entry.text}` : `${entry.text}`;
        })
        .join('\n');

      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const botContent = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botContent) {
        setConversationHistory((prevHistory) => [
          ...prevHistory,
          { role: 'bot', text: botContent },
        ]);
      } else {
        setConversationHistory((prevHistory) => [
          ...prevHistory,
          { role: 'bot', text: 'BranchBuddy is having trouble understanding, please try again!' },
        ]);
      }

      // Increment seedCoin for the current user
      const user = auth.currentUser ;
      if (user) {
        const userRef = doc(db, 'users', user.uid); // Get the user's document reference
        await updateDoc(userRef, {
          seedCoins: increment(1) // Increment seedCoin by 1
        });
      }

      setMessage('');
      scrollToBottom(); // Scroll to the bottom after sending a message
    } catch (error) {
      console.error('Error sending message:', error); // Log the error for debugging
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: 'bot', text: 'Oops! Something went wrong. Let’s try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = (entry: Message, index: number) => {
    return (
      <View key={index} style={styles.messageContainer}>
        {entry.role === 'user' ? (
          <View style={styles.userMessageContainer}>
            <Text style={styles.userMessage}>{`${entry.text}`}</Text>
            <View style={styles.userTriangle}></View>
          </View>
        ) : (
          <View style={styles.botMessageContainer}>
            <Image source={require('../../assets/mascot/1.png')} style={styles.botProfilePic} />
            <Text style={styles.botMessage}>{`${entry.text}`}</Text>
            <View style={styles.botTriangle}></View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messageList}>
          {conversationHistory.map(renderMessage)}
        </ScrollView>
      </View>

      <View
        style={[
          styles.inputContainer,
          { bottom: isKeyboardVisible ? 25 + 55 : 25 },
        ]}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          placeholderTextColor="#888"
          style={styles.textInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
          <Text style={styles.sendButtonText}>{loading ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  messageList: {
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 15,
    width: '100%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 5,
  },
  userMessage: {
    color: '#000',
    fontSize: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '100%',
    textAlign: 'right',
  },
  userTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: Colors.primary,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    position: 'absolute',
    right: -10,
    bottom: 0,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginBottom: 5,
    position: 'relative',
    flexDirection: 'row', // Align image and text in a row
    alignItems: 'center', // Center the image and text vertically
  },
  botProfilePic: {
    width: 60, // Adjust the width as needed
    height: 60, // Adjust the height as needed
    borderRadius: 10, // Make it circular
    marginRight: 10, // Space between the image and the message
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  botMessage: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '100%',
    textAlign: 'left',
  },
  botTriangle: {
    width: 0,
    height: 0,
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: Colors.secondary,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    position: 'absolute',
    left: -10,
    bottom: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: 21,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 15,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  sendButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;