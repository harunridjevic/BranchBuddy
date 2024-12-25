import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Colors } from '../colors';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "branchbuddy-8e817.firebaseapp.com",
  projectId: "branchbuddy-8e817",
  storageBucket: "branchbuddy-8e817.firebasestorage.app",
  messagingSenderId: "322380996428",
  appId: "1:322380996428:web:1e14d61f82a4cfe1cbb9e9",
  measurementId: "G-PNPKDBT443"
};

initializeApp(firebaseConfig);
const db = getFirestore();

const LoginPage = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true); // Manage initial loading state

  const auth = getAuth();

  // Handle login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optionally fetch user data
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User Data:", userDoc.data());
      }

      Alert.alert("Login Successful", `Welcome back, ${user.displayName || 'User'}!`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Login Failed", errorMessage);
      console.error("Login Error:", error);
    }
  };

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user);
        setIsAuthenticated(true); // User is logged in
      } else {
        console.log("No user is logged in.");
        setIsAuthenticated(false); // User is not logged in
      }
      setLoading(false); // Once auth state is checked, update loading state
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [auth]);

  
  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (isAuthenticated) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        });
      } else {
        Alert.alert("You must be logged in to access the home screen.");
      }
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isAuthenticated, navigation]);

  // Show the login page only if it's not loading and not authenticated
  if (loading) {
    return null; // Don't render anything while loading the auth state
  }

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

export default LoginPage;
