import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { Colors } from '../colors';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "branchbuddy-8e817.firebaseapp.com",
  projectId: "branchbuddy-8e817",
  storageBucket: "branchbuddy-8e817.firebasestorage.app",
  messagingSenderId: "322380996428",
  appId: "1:322380996428:web:1e14d61f82a4cfe1cbb9e9",
  measurementId: "G-PNPKDBT443"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Get Firestore instance


const SignUpPage = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // To manage authentication state

  const handleSignUp = async () => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      });

      Alert.alert("Sign-Up Successful", `Welcome, ${username}!`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Sign-Up Failed", errorMessage);
      console.error("Sign-Up Error:", error);
    }
  };

  // Firebase auth state listener to manage authenticated state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Handle back button behavior
  useEffect(() => {
    const backAction = () => {
      if (isAuthenticated) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }] // If authenticated, go to Home
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }] // If not authenticated, go to Login
        });
      }
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Clean up the back handler on unmount
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topbar}></View>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="white"
        cursorColor={Colors.primary}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="white"
        cursorColor={Colors.primary}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="white"
        cursorColor={Colors.primary}
      />
      <Text style={styles.text}>
        Already have an account?{'\n'}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    backgroundColor: 'black',
  },
  topbar: {
    backgroundColor: Colors.secondary,
    height: 10,
    width: '100%',
    borderRadius: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'left',
    color: 'white',
    marginLeft: 2,
  },
  input: {
    height: 60,
    borderColor: Colors.secondary,
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    color: 'white',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    marginTop: 15,
    marginLeft: 3,
    fontSize: 16,
  },
  link: {
    color: Colors.primary,
    marginTop: 5,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    margin: 20,
    bottom: 0,
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpPage;
