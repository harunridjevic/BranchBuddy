import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Animated, Alert } from 'react-native';
import { Colors } from '../colors';
import SeedCard from './SeedCard';
import { db } from '../firebaseConfig'; // Import your Firebase configuration
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore'; // Import Firestore functions
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the Seed interface
interface Seed {
    id: string; // Firestore document ID
    name: string;
    description: string;
    color: string;
    endGoal: number;
    userId: string; // User ID of the creator
    createdAt: string; // Add createdAt to the Seed interface
    lastDone: string;
    isDead: boolean;
    finishedDays: number;
}

const Seeds = () => {
    const [showModal, setShowModal] = useState(false);
    const [seedName, setSeedName] = useState('');
    const [seedDescription, setSeedDescription] = useState('');
    const [seedColor, setSeedColor] = useState('');
    const [seedEndGoal, setSeedEndGoal] = useState('');
    const [seeds, setSeeds] = useState<Seed[]>([]); // State to hold fetched seeds
    const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication status
    const [cardAnimation] = useState(new Animated.Value(0)); // Animation for seed cards
    const [modalAnimation] = useState(new Animated.Value(0)); // Animation for modal

    const auth = getAuth(); // Get the current user

    useEffect(() => {
        const authenticateUser  = async () => {
            const user = auth.currentUser ;
            if (!user) {
                // User is not authenticated, try to sign in with AsyncStorage credentials
                try {
                    const email = await AsyncStorage.getItem('userEmail');
                    const password = await AsyncStorage.getItem('userPassword');

                    if (email && password) {
                        await signInWithEmailAndPassword(auth, email, password);
                        setIsAuthenticated(true); // Set authenticated state to true
                    } else {
                        console.log("No credentials found in AsyncStorage.");
                    }
                } catch (error) {
                    console.error("Error signing in: ", error);
                }
            } else {
                setIsAuthenticated(true); // User is already authenticated
            }
        };

        authenticateUser ();
    }, [auth]);

    useEffect(() => {
        const fetchSeeds = () => {
            const user = auth.currentUser ;
            if (user) {
                const q = query(collection(db, 'seeds'), where('userId', '==', user.uid));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const seedsArray: Seed[] = []; // Explicitly define the type
                    querySnapshot.forEach((doc) => {
                        seedsArray.push({ id: doc.id, ...doc.data() } as Seed); // Cast to Seed type
                    });
                    setSeeds(seedsArray);
                    // Trigger zoom-in animation for the seed cards
                    Animated.timing(cardAnimation, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                });
                return () => unsubscribe(); // Cleanup subscription on unmount
            }
        };

        if (isAuthenticated) {
            fetchSeeds(); // Fetch seeds only if authenticated
        }
    }, [isAuthenticated, auth]);

    // Utility function to format date to dd/mm/yyyy
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleAddSeed = async () => {
        // Validate inputs
        if (!seedName || !seedDescription || !seedColor || !seedEndGoal) {
            Alert.alert(
                "Input Error",
                "Please fill in all fields before adding a seed.",
                [{ text: "OK" }]
            );
            return; // Exit the function if inputs are invalid
        }

        // Ensure endGoal is a valid number
        const endGoalNumber = parseInt(seedEndGoal);
        if (isNaN(endGoalNumber) || endGoalNumber <= 0) {
            Alert.alert(
                "Invalid Goal",
                "Please enter a valid number for the seed goal duration.",
                [{ text: "OK" }]
            );
            return; // Exit the function if endGoal is invalid
        }

        try {
            const user = auth.currentUser ;
            if (user) {
                const createdAt = formatDate(new Date()); // Format the date
                await addDoc(collection(db, 'seeds'), {
                    name: seedName,
                    description: seedDescription,
                    color: seedColor,
                    userId: user.uid,
                    createdAt: createdAt, // Save formatted date
                    lastDone: '', // Initialize lastDone as an empty string
                    isDead: false,
                    finishedDays: 0,
                    endGoal: endGoalNumber // Ensure endGoal is a number
                });

                // Update the user's seedCoins
                const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
                await updateDoc(userDocRef, {
                    seedCoins: increment(10) // Add 10 to the seedCoins field
                });

                // Reset the form
                setSeedName('');
                setSeedDescription('');
                setSeedColor('');
                setSeedEndGoal(''); // Clear the endGoal input
                setShowModal(false); // Close the modal after adding
            }
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const openModal = () => {
        // Check if the user has reached the maximum number of seeds
        if (seeds.length >= 5) {
            Alert.alert(
                "Max Seeds Reached",
                "You have reached the maximum number of seeds. Please delete some seeds to create new ones.",
                [{ text: "OK" }]
            );
            return; // Exit the function to prevent opening the modal
        }

        setShowModal(true);
        // Zoom in animation for the modal
        Animated.timing(modalAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        // Zoom out animation for the modal
        Animated.timing(modalAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowModal(false); // Close the modal after the animation
        });
    };

    return (
        <View style={styles.seedContainer}>
            <View style={styles.container}>
                <Text style={[styles.text, styles.textLeft]}>
                    Recent seeds: {seeds.length}/5
                </Text>
                <TouchableOpacity>
                    <Text style={[styles.text, styles.textRight]}>See all</Text>
                </TouchableOpacity>
            </View>

            {seeds.length === 0 && (
                <Text style={styles.noSeedsText}>
                    No seeds available.
                </Text>
            )}

            <FlatList
                data={seeds} // Use the fetched seeds
                renderItem={({ item }) => (
                    <Animated.View style={{ opacity: cardAnimation, transform: [{ scale: cardAnimation }] }}>
                        <SeedCard seed={item} />
                    </Animated.View>
                )}
                keyExtractor={(item) => item.id} // Use the document ID as the key
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={351}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContentContainer}
            />
            {!showModal && (
                <TouchableOpacity style={styles.addButton} onPress={openModal}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            )}

            {showModal && (
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalContainer, { transform: [{ scale: modalAnimation }] }]}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Create Seed</Text>
                        <TextInput placeholder="Seed Name" placeholderTextColor="#fff" style={styles.input} value={seedName} onChangeText={setSeedName} />
                        <TextInput placeholder="Seed Description" placeholderTextColor="#fff" style={[styles.input, styles.textArea]} value={seedDescription} onChangeText={setSeedDescription} multiline />
                        <TextInput placeholder="Seed Goal Duration (days)" placeholderTextColor="#fff" style={styles.input} value={seedEndGoal} onChangeText={setSeedEndGoal} />
                        <View style={styles.colorButtons}>
                            <Text style={styles.colorsText}>Colors:</Text>
                            {[Colors.blue_color, Colors.yellow_color, Colors.green_color, Colors.red_color].map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[styles.colorButton, { backgroundColor: color }]}
                                    onPress={() => setSeedColor(color)}
                                >
                                    {seedColor === color && (
                                        <Text style={styles.checkmark}>✔</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={handleAddSeed}>
                            <Text style={styles.modalButtonText}>Add Seed</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    seedContainer: {
        height: '85.5%'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    text: {
        color: 'white',
        fontSize: 18,
        marginLeft: 20,
        marginTop: 5,
        marginRight: 20,
        marginBottom: 20
    },
    textLeft: {
        textAlign: 'left',
        color: Colors.secondary,
    },
    textRight: {
        textAlign: 'right',
        color: Colors.tertiary,
    },
    cardWrapper: {
        marginHorizontal: 0, // Remove extra margin between cards for tight spacing
        marginTop: -40
    },
    scrollContentContainer: {
        paddingHorizontal: 0, // Remove any left or right padding
        marginTop: -20
    },
    addButton: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        width: 75,
        height: 75,
        borderRadius: 60,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure it's above other elements
    },
    addButtonText: { fontSize: 40, color: 'white' },
    modalOverlay: {
        position: 'absolute',
        top: -200, // Changed to 0 to cover the entire screen
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba( 0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '101%',
        zIndex: 5, // Ensure the modal overlay is behind the button
    },
    modalContainer: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
        color: 'white',
        borderWidth: 5,
        borderColor: Colors.primary,
        zIndex: 10, // Ensure modal content stays on top of the overlay
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    colorButton: { width: 40, height: 40, borderRadius: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    modalButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    cancelButton: { backgroundColor: 'gray' },
    modalButtonText: { color: 'black', fontWeight: 'bold' },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        backgroundColor: 'transparent',
        padding: 5,
        zIndex: 15, // Ensure the close button stays on top of the modal
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        padding: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
        color: 'white'
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    colorButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    colorsText: {
        color: 'white',
        fontSize: 20,
        paddingTop: 7,
        paddingLeft: 5,
    },
    checkmark: {
        position: 'absolute',
        top: 5,
        right: 10,
        color: 'black',
        fontSize: 18,
    },
    noSeedsText: {
        color: Colors.secondary,
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20, // Add some vertical margin for spacing
    },
});

export default Seeds;