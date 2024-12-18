import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from '../colors';

interface History {
  user: string;
  assistant: string;
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // State for user input
  const [response, setResponse] = useState<string>(''); // State for assistant's response
  const [history, setHistory] = useState<History[]>([]); // State for chat history
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false); // State for keyboard visibility
  const scrollViewRef = useRef<ScrollView>(null); // Reference to ScrollView

  const customPrompt =
    "You are a kind, supportive, and empathetic virtual assistant focused on self-care and emotional well-being. Your goal is to help users feel heard, uplifted, and motivated to take small steps toward improving their mental wellness. Be warm, non-judgmental, and encouraging. Validate the user’s feelings, offer practical self-care tips (like breathing exercises, journaling, or mindfulness), and celebrate their small victories. Use a calm and conversational tone. Avoid giving medical, financial, or legal advice. If a user needs professional help, gently suggest speaking to a licensed therapist or counselor. Always focus on positivity, empowerment, and small actionable steps to help users feel better.";

  const sendMessage = async () => {
    try {
      const apiKey = 'AIzaSyAphD3uuKMhuUv4kSRF8CvgEk_2G1EYWBM'; // Replace with your actual API key

      const messageWithPrompt = `${customPrompt} \n\nUser's message: ${message}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: messageWithPrompt,
              },
            ],
          },
        ],
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        const content = data.candidates[0].content;
        const assistantResponse = content.parts.map((part: any) => part.text).join(' ');

        setResponse(assistantResponse);
        setHistory((prevHistory) => [
          ...prevHistory,
          { user: message, assistant: assistantResponse },
        ]);
        setMessage('');
      } else {
        setResponse('No response received');
      }
    } catch (error) {
      console.error('Error fetching from chatbot:', error);
      setResponse('Error fetching response');
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100); // Add a small delay to allow content to render
    }
  }, [history]); // Trigger on history change (new message)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            style={styles.chatHistory}
            keyboardShouldPersistTaps="handled"
            ref={scrollViewRef} // Attach ref here
            contentContainerStyle={styles.chatHistoryContent}
          >
            {history.map((entry, index) => (
              <View key={index} style={styles.chatEntry}>
                <View style={styles.userMessageContainer}>
                  <Text style={styles.userMessage}>{entry.user}</Text>
                </View>
                <View style={styles.assistantMessageContainer}>
                  <Text style={styles.assistantMessage}>{entry.assistant}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={[styles.inputContainer, { paddingBottom: keyboardVisible ? 235 : 60 }]}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message"
              style={styles.input}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
  },
  chatHistory: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chatHistoryContent: {
    flexGrow: 1, // Ensures ScrollView content stretches to fill the height
    justifyContent: 'flex-end', // Aligns the content at the bottom
  },
  chatEntry: {
    marginBottom: 15,
    marginHorizontal: 8,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 5,
    maxWidth: '80%',
  },
  userMessage: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 10,
    marginBottom: 5,
    maxWidth: '80%',
  },
  assistantMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#000',
    paddingBottom: 30,
  },
  input: {
    flex: 1,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Chatbot;
