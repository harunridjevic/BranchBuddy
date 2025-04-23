import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Animated, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SeedScreen from './Seeds';
import NotesScreen from './Notes';
import ChatScreen from './Chat';
import CalendarScreen from './Calendar';
import ShopScreen from './Shop';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

type RootStackParamList = { Home: undefined; Profile: undefined; Login: undefined; Details: { id: number }; };

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface TutorialModalProps {
    visible: boolean;
    onClose: () => void;
    tutorialMessage: string;
    tutorialTitle: string; // Add this line
    translateY: Animated.Value;
    currentIndex: number;
    totalTutorials: number;
    onNext: () => void;
    onPrev: () => void;
    imageSource: any;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose, tutorialMessage, tutorialTitle, translateY, currentIndex, totalTutorials, onNext, onPrev, imageSource }) => {
    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 500,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, translateY]);

    return (
        <Animated.View style={[styles.tutorialModal, { transform: [{ translateY }] }]}>
            <View style={styles.tutorialContent}>
                <Image source={imageSource} style={styles.tutorialImage} />
                <Text style={styles.tutorialTitle}>{tutorialTitle}</Text> {/* Update this line */}
                <Text style={styles.tutorialText}>{tutorialMessage}</Text>
                <View style={styles.navigationContainer}>
                    <TouchableOpacity onPress={onPrev} disabled={currentIndex === 0} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>{'<'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onNext} disabled={currentIndex === totalTutorials - 1} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.dotsContainer}>
                    {Array.from({ length: totalTutorials }, (_, index) => (
                        <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
                    ))}
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const Home: React.FC<Props> = ({ navigation }) => {
    const [selectedButton, setSelectedButton] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(1));
    const [bottomBarPosition] = useState(new Animated.Value(0));
    const [activeScreen, setActiveScreen] = useState<React.ReactNode>(<SeedScreen />);
    const [username, setUsername] = useState<string>('Guest');
    const [showBottomBar, setShowBottomBar] = useState<boolean>(true);
    const [seedCoins, setSeedCoins] = useState<number>(0);
    const [mascotImage, setMascotImage] = useState<number>(require('../../assets/mascot/1.png'));
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [changeAmount, setChangeAmount] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [mascotScale] = useState(new Animated.Value(1));
    const [bubbleScale] = useState(new Animated.Value(0));
    const [componentScale] = useState(new Animated.Value(0));
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialMessage, setTutorialMessage] = useState('');
    const [tutorialTitle, setTutorialTitle] = useState(''); // State for tutorial title
    const translateY = useRef(new Animated.Value(500)).current;
    const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);

    const screens = [
        <SeedScreen key="seeds" />,
        <NotesScreen key="notes" />,
        <CalendarScreen key="calendar" />,
        <ShopScreen key="shop" />,
        <ChatScreen key="chat" />
    ];

    const tutorials = [
        "In the Seeds tab, you can manage your seeds and view their details.",
        "In the Notes tab, you can create and manage your notes.",
        "In the Calendar tab, you can view and manage your events.",
        "In the Shop tab, you can purchase items and manage your inventory.",
        "In the Chat tab, you can communicate with other users."
    ];

    const tutorialTitles = [
        "Seeds Tutorial",
        "Notes Tutorial",
        "Calendar Tutorial",
        "Shop Tutorial",
        "Chat Tutorial"
    ];

    const tutorialImages = [
        require('../../assets/tutorial_mascot/1.png'),
        require('../../assets/tutorial_mascot/2.png'),
        require('../../assets/tutorial_mascot/3.png'),
        require('../../assets/tutorial_mascot/4.png'),
        require('../../assets/tutorial_mascot/5.png'),
    ];

    const handleScreenChange = (index: number) => {
        if (index !== selectedButton) {
            setSelectedButton(index);
            setActiveScreen(screens[index]);
            setShowBottomBar(index !== 4);
        }
    };

    const showTutorialForTab = (index: number) => {
        setCurrentTutorialIndex(index);
        setTutorialMessage(tutorials[index]);
        setTutorialTitle(tutorialTitles[index]); // Set the tutorial title based on the selected tab
        setShowTutorial(true);
    };

    const goToNextTutorial = () => {
        if (currentTutorialIndex < tutorials.length - 1) {
            const newIndex = currentTutorialIndex + 1;
            setCurrentTutorialIndex(newIndex);
            setTutorialMessage(tutorials[newIndex]);
            setTutorialTitle(tutorialTitles[newIndex]); // Update the title
        }
    };

    const goToPrevTutorial = () => {
        if (currentTutorialIndex > 0) {
            const newIndex = currentTutorialIndex - 1;
            setCurrentTutorialIndex(newIndex);
            setTutorialMessage(tutorials[newIndex]);
            setTutorialTitle(tutorialTitles[newIndex]); // Update the title
        }
    };

    useEffect(() => {
        const checkFirstLaunch = async () => {
            const hasLaunched = await AsyncStorage.getItem('hasLaunched');
            if (!hasLaunched) {
                setShowTutorial(true);
                setTutorialMessage(tutorials[0]);
                setTutorialTitle(tutorialTitles[0]); // Set the title for the first tutorial
                await AsyncStorage.setItem('hasLaunched', 'true');
            }
        };

        checkFirstLaunch();
    }, []);

    useEffect(() => {
        const checkRememberedUser   = async () => {
            const rememberedEmail = await AsyncStorage.getItem('userEmail');
            const rememberedPassword = await AsyncStorage.getItem('userPassword');
            if (rememberedEmail && rememberedPassword) {
                try {
                    const auth = getAuth();
                    const userCredential = await signInWithEmailAndPassword(auth, rememberedEmail, rememberedPassword);
                    const user = userCredential.user;
                    const displayName = user.displayName || user.email || 'Guest';
                    setUsername(displayName);
                    subscribeToSeedCoins(user.uid);
                } catch (error) {
                    console.error("Error signing in with remembered credentials:", error);
                    await AsyncStorage.removeItem('userEmail');
                    await AsyncStorage.removeItem('userPassword');
                    navigation.navigate('Login');
                }
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
                    subscribeToSeedCoins(user.uid);
                } else {
                    navigation.navigate('Login');
                }
            });

            return () => unsubscribe();
        };

        checkRememberedUser  ();

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            if (selectedButton !== 4) {
                Animated.timing(bottomBarPosition, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    setShowBottomBar(false);
                });
                Animated.timing(mascotScale, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            if (selectedButton !== 4) {
                setShowBottomBar(true);
                bottomBarPosition.setValue(100);
                Animated.timing(bottomBarPosition, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
                Animated.timing(mascotScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [navigation, selectedButton]);

    const subscribeToSeedCoins = (userId: string) => {
        const db = getFirestore();
        const docRef = doc(db, 'users', userId);
        
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const newSeedCoins = data.seedCoins || 0;

                setSeedCoins((prevSeedCoins) => {
                    const change = newSeedCoins - prevSeedCoins;
                    if (change !== 0) {
                        setChangeAmount(change);
                        setBubbleVisible(true);
                        Animated.timing(bubbleScale, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => {
                            setTimeout(() => {
                                Animated.timing(bubbleScale, {
                                    toValue: 0,
                                    duration: 300,
                                    useNativeDriver: true,
                                }).start(() => {
                                    setBubbleVisible(false);
                                    setChangeAmount(0);
                                });
                            }, 2000);
                        });
                    }
                    return newSeedCoins;
                });
            } else {
                console.log("No such document!");
            }
        });

        return unsubscribe;
    };

    const go_to_chat = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: 4 * 130, animated: true });
        }
        setSelectedButton(4);
        setActiveScreen(<ChatScreen />);
        setShowBottomBar(false);
    };

    const go_to_shop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: 3 * 130, animated: true });
        }
        setSelectedButton(3);
        setActiveScreen(<ShopScreen />);
        setShowBottomBar(true);
    };

    const go_to_profile = async () => {
        navigation.navigate('Profile');
    };

    const getTruncatedUsername = (name: string) => {
        return name.length > 11 ? `${name.substring(0, 8)}...` : name;
    };

    useEffect(() => {
        const originalImage = require('../../assets/mascot/1.png');
        const alternateImage = require('../../assets/mascot/1_closedeyes.png');

        const animateMascotImage = () => {
            setMascotImage(originalImage);
            setTimeout(() => {
                setMascotImage(alternateImage);
                setTimeout(() => {
                    setMascotImage(originalImage);
                    setTimeout(() => {
                        setMascotImage(originalImage);
                        setTimeout(() => {
                            setMascotImage(alternateImage);
                            setTimeout(() => {
                                animateMascotImage();
                            }, 1000);
                        }, 5000);
                    }, 500);
                }, 500);
            }, 500);
        };

        animateMascotImage();

        Animated.timing(componentScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        return () => {};
    }, []);

    const renderBubble = () => {
        if (!bubbleVisible) return null;

        return (
            <Animated.View style={[styles.bubble, { transform: [{ scale: bubbleScale }] }]}>
                <Text style={styles.bubbleText}>
                    {changeAmount > 0 ? `+${changeAmount}` : changeAmount}
                </Text>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.text, { fontSize: 35, fontWeight: 'bold', margin: 20 }]}>
                    Hello {getTruncatedUsername(username)}
                </Text>
                <Text style={[styles.text, { fontSize: 19, fontWeight: 'bold', position: 'absolute', top: 55, left: 10, borderBottomWidth: 5, borderBottomColor: Colors.primary, margin: 10 }]}>
                    {seedCoins} Σ
                </Text>
                {renderBubble()}
                <TouchableOpacity style={styles.account_btn} onPress={go_to_profile}>
                    <Image source={require('../../assets/images/account_icon.png')} style={styles.account_btn_icon} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                style={styles.scroll}
                ref={scrollViewRef}
            >
                {['Seeds', 'Notes', 'Calendar', 'Shop', 'Chat'].map((item, index) => (
                    <View key={item} style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.box, selectedButton === index && { backgroundColor: Colors.primary }]}
                            onPress={() => handleScreenChange(index)}
                        >
                            <Text style={[styles.box_text, selectedButton === index && { color: Colors.secondary }]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => showTutorialForTab(index)} style={styles.questionMarkButton}>
                            <Text style={styles.questionMarkText}>?</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ width: 20 }} />
            </ScrollView>

            <View style={styles.module_screen}>
                <Animated.View style={[styles.screenContainer, { opacity: fadeAnim, transform: [{ scale: componentScale }] }]}>
                    {activeScreen}
                </Animated.View>
            </View>

            {showBottomBar && (
                <Animated.View style={[styles.bottom_bar, { transform: [{ translateY: bottomBarPosition }] }]}>
                    <TouchableOpacity style={styles.input} onPress={go_to_chat}>
                        <Animated.Image
                            source={mascotImage}
                            style={[styles.mascot_image, { transform: [{ scale: mascotScale }] }]}
                        />
                        <Image
                            source={require('../../assets/chat_icon.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.input_text}>Send message to BranchBuddy...</Text>
                        <Image
                            source={require('../../assets/images/send_icon.png')}
                            style={styles.send_message}
                        />
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Tutorial Modal */}
            <TutorialModal 
                visible={showTutorial} 
                onClose={() => setShowTutorial(false)} 
                tutorialMessage={tutorialMessage} 
                tutorialTitle={tutorialTitle} // Pass the title
                translateY={translateY} 
                currentIndex={currentTutorialIndex} 
                totalTutorials={tutorials.length} 
                onNext={goToNextTutorial} 
                onPrev={goToPrevTutorial} 
                imageSource={tutorialImages[currentTutorialIndex]} 
            />
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
        alignItems: 'center',
    },
    icon: {
        height: 30,
        width: 30,
        marginRight: 10,
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
        paddingLeft: -100,
        borderRadius: 5,
        height: 50,
        width: 135,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box_text: {
        color: 'white',
        marginLeft: -20
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
        position: 'absolute',
        bottom: 0,
    },
    mascot_image: {
        position: 'absolute',
        width: 140,
        height: 140,
        bottom: 70,
        left: 10,
    },
    bubble: {
        position: 'absolute',
        top: 65,
        left: 80,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        paddingRight: 20,
        paddingTop: 9,
        paddingBottom: 9,
        zIndex: 1,
    },
    bubbleText: {
        color: Colors.secondary,
        fontWeight: 'bold',
        left: 10,
    },
    tutorialModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'black',
        borderColor: Colors.primary,
        borderTopWidth: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 5,
    },
    tutorialContent: {
        flex: 1,
        alignItems: 'center',
    },
    tutorialImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    tutorialTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        padding: 5
    },
    tutorialText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: 'white'
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: -50,
        bottom: 75,
        position: 'absolute'
    },
    arrowButton: {
        padding: 10,
        backgroundColor: Colors.primary,
        height: 60,
        width: 60,
        borderRadius: 30
    },
    arrowText: {
        fontSize: 35,
        color: Colors.secondary,
        marginLeft: 10,
        marginTop: -6
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        bottom: 40,
        position: 'absolute'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        margin: 5,
    },
    activeDot: {
        backgroundColor: 'white',
    },
    closeButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        bottom: 10,
        position: 'absolute'
    },
    closeButtonText: {
        color: Colors.secondary,
        fontWeight: 'bold',
    },
    tabContainer: {
        alignItems: 'center',
        marginRight: 10,
    },
    questionMarkButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        padding: 5,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
        marginRight: -90
    },
    questionMarkText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: -2
    },
});

export default Home;