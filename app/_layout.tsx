<<<<<<< HEAD
<<<<<<< HEAD
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './screens/Home';
import ChatScreen from './screens/Chat';
import LoginPage from './screens/Login';
import SignUpPage from './screens/SignUp';

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Login: undefined;
  SignUp: undefined;
  Details: { id: number };
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated

  // Simulate checking for authentication status (e.g., from storage or context)
  useEffect(() => {
    const checkAuthentication = async () => {
      // Replace with actual auth check (e.g., check for token or user data)
      const userIsAuthenticated = false; // Example, replace with actual logic
      setIsAuthenticated(userIsAuthenticated);
    };
    
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Set the global status bar color */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Add a global View wrapper to enforce a black background */}
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? "Home" : "Login"} // Set initial route based on authentication status
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
            cardStyleInterpolator: ({ current, next, layouts }) => {
              const translateX = current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-layouts.screen.width, 0],  // Start from right off-screen
              });
              return {
                cardStyle: {
                  transform: [{ translateX }],
                },
              };
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
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
=======
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './screens/Home';
import ChatScreen from './screens/Chat';

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Details: { id: number };
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Set the global status bar color */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Add a global View wrapper to enforce a black background */}
      <View style={styles.container}>
        <Stack.Navigator
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
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
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
>>>>>>> 6ce4109ac8569b5fc5d77a90253a84a1b499ee38
=======
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './screens/Home';
import ChatScreen from './screens/Chat';

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Details: { id: number };
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Set the global status bar color */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Add a global View wrapper to enforce a black background */}
      <View style={styles.container}>
        <Stack.Navigator
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
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
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
>>>>>>> 6ce4109ac8569b5fc5d77a90253a84a1b499ee38
