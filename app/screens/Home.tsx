import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SeedScreen from './Seeds';
import NotesScreen from './Notes';
import ChatScreen from './Chat';
import CalendarScreen from './Calendar';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Details: { id: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [activeScreen, setActiveScreen] = useState<React.ReactNode>(<SeedScreen />);
  const [username, setUsername] = useState<string>('Guest');
  const [showBottomBar, setShowBottomBar] = useState<boolean>(true);
  const scrollViewRef = useRef<ScrollView>(null); // Reference for ScrollView

  const screens = [<SeedScreen />, <NotesScreen />, <CalendarScreen />, <ChatScreen />];

  useEffect(() => {
    const checkRememberedUser = async () => {
      const rememberedUser = await AsyncStorage.getItem('rememberMeUser');
      if (rememberedUser) {
        setUsername(rememberedUser);
      } else {
        handleAuthState();
      }
    };

    const handleAuthState = () => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const displayName = user.displayName || user.email || 'Guest';
          setUsername(displayName);
          AsyncStorage.setItem('rememberMeUser', displayName);
        } else {
          navigation.navigate('Login');
        }
      });

      return () => unsubscribe();
    };

    checkRememberedUser();
  }, [navigation]);

  const handleScreenChange = (index: number) => {
    if (index !== selectedButton) {
      setActiveScreen(screens[index]);
      setSelectedButton(index);
      setShowBottomBar(index !== 3);
    }
  };

  const go_to_chat = () => {
    // Scroll to the right smoothly to the Chat section
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 3 * 130, animated: true }); // Assuming each button is 130px wide
    }

    setSelectedButton(3);
    setActiveScreen(<ChatScreen />);
    setShowBottomBar(false);
  };

  const go_to_login = async () => {
    await AsyncStorage.removeItem('rememberMeUser');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.text, { fontSize: 35, fontWeight: 'bold', margin: 20 }]}>
          Hello {username}
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
        <TouchableOpacity style={styles.account_btn} onPress={go_to_login}>
          <Image
            source={require('../../assets/images/account_icon.png')}
            style={styles.account_btn_icon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        style={styles.scroll}
        ref={scrollViewRef} // Attach the reference here
      >
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
        <View style={{ width: 20 }} />
      </ScrollView>

      <View style={styles.module_screen}>
        <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
          {activeScreen}
        </Animated.View>
      </View>

      {showBottomBar && (
        <View style={styles.bottom_bar}>
          <TouchableOpacity style={styles.input} onPress={go_to_chat}>
            <Text style={styles.input_text}>Send message to BranchBuddy...</Text>
            <Image
              source={require('../../assets/images/send_icon.png')}
              style={styles.send_message}
            />
          </TouchableOpacity>
        </View>
      )}
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
    paddingRight: 20,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input_text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 20,
    flex: 1,
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
