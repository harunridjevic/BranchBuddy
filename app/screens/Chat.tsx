import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

interface History {
  user: string;
  assistant: string;
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [history, setHistory] = useState<History[]>([]);

  const sendMessage = async () => {
    try {
      const res = await fetch('https://huggingface.co/spaces/branchbuddy/bb/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: history,
          system_message: 'You are a friendly Chatbot.',
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
        }),
      });

      const data = await res.json();
      setResponse(data.text); // Adjust this to match the response structure from your API
      setHistory((prevHistory) => [
        ...prevHistory,
        { user: message, assistant: data.text },
      ]);
      setMessage('');
    } catch (error) {
      console.error('Error fetching from chatbot:', error);
    }
  };

  return (
    <View>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message"
        style={{ borderWidth: 1, padding: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
      <Text>{response}</Text>
    </View>
  );
};

export default Chatbot;
