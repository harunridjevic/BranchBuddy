import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../colors'; // Ensure this path is correct
import { db } from '../firebaseConfig'; // Import your Firebase configuration
import { doc, updateDoc, increment, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// Define the props type for SeedCard
interface SeedCardProps {
    seed: {
        id: string; // Add the id field
        name: string;
        description: string;
        color: string;
        createdAt: string;
        lastDone: string; // Include lastDone in the seed prop
        isDead: boolean; // Include isDead in the seed prop
        endGoal: number; // Add endGoal to the seed prop
        finishedDays: number; // Add finishedDays to the seed prop
    };
}

const SeedCard: React.FC<SeedCardProps> = ({ seed }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isDead, setIsDead] = useState(seed.isDead); // Initialize isDead from seed prop
    const [finishedDays, setFinishedDays] = useState(seed.finishedDays); // Initialize finishedDays from seed prop
    const progressAnim = useRef(new Animated.Value(0)).current; // Create an animated value

    // Calculate progress percentage based on finishedDays
    const progress = Math.min((finishedDays / seed.endGoal) * 100, 100);

    // Check if today's date matches lastDone when the component mounts
    useEffect(() => {
        const today = formatDate(new Date());
        if (seed.lastDone === today) {
            setIsChecked(true);
        }

        // Check if today's date is more than or equal to 2 days after lastDone
        if (seed.lastDone) { // Ensure lastDone is defined
            const lastDoneDate = new Date(seed.lastDone.split('/').reverse().join('-')); // Convert dd/mm/yyyy to Date
            const daysDiff = Math.floor((new Date().getTime() - lastDoneDate.getTime()) / (1000 * 3600 * 24));
            if (daysDiff >= 2 && progress < 100) { // Only set isDead if progress is not 100%
                setIsDead(true); // Set isDead to true if more than 2 days have passed
            }
        }
    }, [seed.lastDone, progress]);

    const calculateDaysSinceCreated = (createdAt: string) => {
        if (!createdAt) {
            return 0;
        }
        const createdDate = new Date(createdAt.split('/').reverse().join('-'));
        const today = new Date();
        const timeDiff = today.getTime() - createdDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    const daysSinceCreated = calculateDaysSinceCreated(seed.createdAt);

    // Animate the progress bar whenever finishedDays changes
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500, // Duration of the animation
            easing: Easing.out(Easing.ease), // Easing function for smoothness
            useNativeDriver: false, // Use native driver for better performance
        }).start();
    }, [finishedDays]);

    const getBackgroundGif = (color: string) => {
        switch (color) {
            case Colors.blue_color:
                return require('../../assets/gifs/blue_card_bg.gif');
            case Colors.yellow_color:
                return require('../../assets/gifs/yellow_card_bg.gif');
            case Colors.red_color:
                return require('../../assets/gifs/red_card_bg.gif');
            default:
                return require('../../assets/gifs/green_card_bg.gif');
        }
    };

    const getPlantImage = () => {
        if (progress === 100) {
            return require('../../assets/images/golden_tree.png'); // Path to your special tree image
        } else if (isDead) {
            return require('../../assets/images/dead_tree.png'); // Path to your dead tree image
        } else if (progress <= 20) {
            return require('../../assets/images/seed.png');
        } else if (progress <= 50) {
            return require('../../assets/images/sapling.png');
        } else {
            return require('../../assets/images/grown_tree.png');
        }
    };

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleCheckmarkClick = async () => {
        // Only allow checking if it's not already checked and not dead
        if (!isChecked && !isDead && progress < 100) {
            setIsChecked(true); // Set the checkmark state to checked
            setFinishedDays(prev => prev + 1); // Increment finishedDays

            // Update lastDone and finishedDays in Firestore
            const today = formatDate(new Date());
            const seedDocRef = doc(db, 'seeds', seed.id); // Reference to the seed document

            try {
                await updateDoc(seedDocRef, {
                    lastDone: today, // Update lastDone with today's date
                    finishedDays: finishedDays + 1 // Update finishedDays
                });

                // Increment the user's seedCoins by 1
                const auth = getAuth();
                const user = auth.currentUser ;
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
                    await updateDoc(userDocRef, {
                        seedCoins: increment(1) // Increment seedCoins by 1
                    });
                }
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    const handleDeleteSeed = async () => {
        const seedDocRef = doc(db, 'seeds', seed.id); // Reference to the seed document

        // Show confirmation alert before deleting
        Alert.alert(
            "Delete Seed",
            "Are you sure you want to delete this seed?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteDoc(seedDocRef); // Delete the seed document
                            console.log("Seed deleted successfully");
                        } catch (error) {
                            console.error("Error deleting document: ", error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Image
                source={getBackgroundGif(seed.color)}
                style={styles.background}
            />
            {/* Vertical Progress Bar */}
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { height: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                }) }]} />
            </View>
            {/* Conditionally render the checkmark button */}
            {progress < 100 && !isDead && (
                <TouchableOpacity
                    style={styles.checkmarkButton}
                    onPress={handleCheckmarkClick}
                >
                    <Text style={styles.checkmarkText}>
                        {isChecked ? '✓' : ''}
                    </Text>
                </TouchableOpacity>
            )}
            <Text style={[styles.text, styles.top_text]}>{seed.name}</Text>
            <Text style={[styles.text, styles.description_text]}>{seed.description}</Text>
            <Image 
                source={getPlantImage()}
                style={progress === 100 ? styles.specialPlantImage : styles.plantImage} // Use special style for the golden tree
            />
            <Text style={[styles.text, styles.day_text]}>
                {progress === 100 ? 'DONE' : (isDead ? 'DEAD' : `Day ${daysSinceCreated + 1}`)}
            </Text>
            {/* Delete Seed Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSeed}>
                <Text style={styles.deleteButtonText}>Delete Seed</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 330,
        marginLeft: 20,
        marginTop: 20,
        height: '77%',
        borderRadius: 40,
        overflow: 'hidden', 
        position: 'relative', 
    },
    background: {
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Sends the image behind everything else
    },
    progressBarContainer: {
        position: 'absolute',
        left: 15,
        top: 20,
        bottom: 20,
        width: 20, // Width of the progress bar
        backgroundColor: 'rgba(0,0,0,0.5)', // Background color of the bar
        borderRadius: 20, // Rounded edges
    },
    progressBar: {
        backgroundColor: 'black', // Color of the filled part
        borderRadius: 20, // Rounded edges
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    top_text: {
        marginTop: 40,
        marginLeft: 50,
        fontWeight: '800',
        fontSize: 22,
        color: 'black'
    },
    description_text: {
        marginLeft: 50,
        color: 'black',
        marginTop: 10
    },
    plantImage: {
        width: '80%', // Default size for other plants
        height: '80%',
        resizeMode: 'contain',
        position: 'absolute',
        bottom: -50,
        right: -30
    },
    specialPlantImage: {
        width: '90%', // Increase size for the special tree
        height: '90%', // Increase size for the special tree
        resizeMode: 'contain',
        position: 'absolute',
        bottom: -32, // Adjust position if needed
        right: -20 // Adjust position if needed
    },
    day_text: {
        position: 'absolute',
        color: 'black',
        fontWeight: '900',
        bottom: 0,
        left: 20,
        margin: 30,
        fontSize: 20
    },
    checkmarkButton: {
        position: 'absolute',
        top: 15,  // Adjusting margin from the top
        right: 15, // Adjusting margin from the right
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
        borderRadius: 25,  // Making the button circular
        width: 50, // Width of the circular button
        height: 50, // Height of the circular button
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
        zIndex: 1, // Ensure it is above other elements
    },
    checkmarkText: {
        fontSize: 30, // Adjust the size of the checkmark
        color: 'white',
        fontWeight: 'bold', // Make it bold for better visibility
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.5)', // Red background for delete button
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: 150,
        position: 'absolute',
        left: 50,
        top: 130
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default SeedCard;