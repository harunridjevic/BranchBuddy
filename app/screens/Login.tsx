import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Colors } from '../colors';

// Prevent duplicate Firebase initialization
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'branchbuddy-8e817.firebaseapp.com',
  projectId: 'branchbuddy-8e817',
  storageBucket: 'branchbuddy-8e817.firebasestorage.app',
  messagingSenderId: '322380996428',
  appId: '1:322380996428:web:1e14d61f82a4cfe1cbb9e9',
  measurementId: 'G-PNPKDBT443',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const LoginPage = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser ] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      setUser (currentUser );
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load remembered email and password on mount
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const savedPassword = await AsyncStorage.getItem('userPassword');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    };
    loadRememberedCredentials();
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser  = userCredential.user;

      if (rememberMe) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password); // Store password
      } else {
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userPassword'); // Remove password
      }

      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', loggedInUser .uid));
      if (userDoc.exists()) {
        console.log('User  Data:', userDoc.data());
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Login Failed', errorMessage);
      console.error('Login Error:', error);
    }
  };

  if (loading) return null; // Don't render while loading

  return (
    <View style={styles.container}>
      <View style={styles.topbar}></View>
      <Text style={styles.title}>Login</Text>
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
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={rememberMe ? 'checked' : 'unchecked'}
          onPress={() => setRememberMe(!rememberMe)}
          color={Colors.primary}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      <Text style={styles.text}>
        Don't have an account?{'\n'}
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: -5,
  },
  rememberMeText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
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
    marginBottom: 20,
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

export default LoginPage;