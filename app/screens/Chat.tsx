import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { Colors } from '../colors'

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const updatedHistory: Message[] = [
        ...conversationHistory,
        { role: 'user', text: message },
      ];
      setConversationHistory(updatedHistory);

      const personalityInstructions = `
        You are BranchBuddy, an AI with a friendly and motivational personality. 
        You should always encourage the user, stay positive, and offer helpful advice with a supportive tone.
      `;

      const prompt = `${personalityInstructions}\n` + updatedHistory
        .map((entry) => {
          if (entry.role === 'user') {
            return `You: ${entry.text}`;
          } else if (entry.role === 'bot') {
            return `BranchBuddy: ${entry.text}`;
          }
          return '';
        })
        .join('\n');

      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAphD3uuKMhuUv4kSRF8CvgEk_2G1EYWBM',
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
    } catch (error) {
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: 'bot', text: 'Oops! Something went wrong. Let’s try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={styles.messageList}>
          {conversationHistory.map((entry, index) => (
            <View key={index} style={styles.messageContainer}>
              {entry.role === 'user' ? (
                <View style={styles.userMessageContainer}>
                  <Text style={styles.userMessage}>{`You: ${entry.text}`}</Text>
                  <View style={styles.userTriangle}></View>
                </View>
              ) : (
                <View style={styles.botMessageContainer}>
                  <View style={styles.botTriangle}></View>
                  <Text style={styles.botMessage}>{`BranchBuddy: ${entry.text}`}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    bottom: 15,
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
