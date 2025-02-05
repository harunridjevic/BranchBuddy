import React, { useState, useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './screens/Home';
import LoginPage from './screens/Login';
import SignUpPage from './screens/SignUp';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  Details: { id: number };
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Custom fade interpolator
const fadeInOutInterpolator = ({ current }: { current: { progress: any } }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Track if user is authenticated

  const auth = getAuth();

  // Check if the user is authenticated when the app starts
  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if the user is logged in through Firebase Auth or AsyncStorage
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is logged in, set authenticated state
          setIsAuthenticated(true);
        } else {
          // No user logged in, check AsyncStorage for saved email
          const savedEmail = await AsyncStorage.getItem('userEmail');
          if (savedEmail) {
            // If a saved email exists, we automatically authenticate the user
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      });
    };

    checkAuthentication();
  }, [auth]);

  useEffect(() => {
    if (loaded && isAuthenticated !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthenticated]);

  if (!loaded || isAuthenticated === null) {
    return null; // Don't render while loading or checking authentication
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Set the global status bar color */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Add a global View wrapper to enforce a black background */}
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'Home' : 'Login'} // Set initial route based on authentication status
          screenOptions={{
            headerStyle: {
              elevation: 0,
              backgroundColor: '#000',
            },
            cardStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: false,
            cardStyleInterpolator: fadeInOutInterpolator, // Use custom fade transition
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 200 } }, // Change duration here
              close: { animation: 'timing', config: { duration: 200 } }, // Change duration here
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
        </Stack.Navigator>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Global black background
  },
});