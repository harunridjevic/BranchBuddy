import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Colors } from '../colors';

// Firebase configuration
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
const db = getFirestore(app);

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
    const [tasks, setTasks] = useState<any[]>([]); // State for tasks
    const [calendarAnimation] = useState(new Animated.Value(0)); // Animation for calendar loading
    const [tasksAnimation] = useState(new Animated.Value(0)); // Animation for tasks loading

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
        setSelectedDay(newDate.getMonth() === new Date().getMonth() ? new Date().getDate() : 1);
    };

    const getAdjustedDays = () => {
        const adjustedDays = [...days];
        if (firstDayOfMonth !== 0) {
            const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
            adjustedDays.unshift(...Array(startOffset).fill(null));  // Add blank days to align the start on Monday
        }
        return adjustedDays;
    };

    // Fetch tasks from Firestore based on the selected day
    useEffect(() => {
        const fetchTasks = async () => {
            const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
            const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
            console.log(`Fetching tasks for: ${formattedDate}`);

            const q = query(
                collection(db, 'notes'), // Replace 'notes' with your collection name
                where('createdAt', '==', formattedDate) // Compare with the formatted date
            );

            try {
                const querySnapshot = await getDocs(q);
                const fetchedTasks: any[] = [];
                querySnapshot.forEach((doc) => {
                    const taskData = doc.data();
                    console.log(`Fetched Document ID: ${doc.id}, Data: ${taskData}`);
                    fetchedTasks.push({ id: doc.id, ...taskData });
                });
                console.log(`Fetched Tasks: ${fetchedTasks}`);
                setTasks(fetchedTasks);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        };

        fetchTasks();
    }, [selectedDay, currentDate]); // Fetch tasks when selectedDay or currentDate changes

    // Utility function to format date to dd/mm/yyyy
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isCurrentDay = (item: number) => {
        return (
            item === currentDate.getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()
        );
    };

    useEffect(() => {
        // Trigger zoom-in animation for the calendar when it loads
        Animated.timing(calendarAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        // Trigger zoom-in animation for the tasks when they are fetched
        Animated.timing(tasksAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [tasks]); // Run this effect when tasks change

    return (
        <View style={styles.container}>
            <Animated.View style={{ flex: 1, opacity: calendarAnimation, transform: [{ scale: calendarAnimation }] }}>
                {/* Top Part (Calendar) */}
                <View style={styles.calendarSection}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => changeMonth(-1)}>
                            <Text style={styles.navText}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
                        <TouchableOpacity onPress={() => changeMonth(1)}>
                            <Text style={styles.navText}>{'>'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekdays}>
                        {weekdays.map((day, index) => (
                            <Text key={index} style={styles.weekdayText}>{day}</Text>
                        ))}
                    </View>

                    <FlatList
                        data={getAdjustedDays()}
                        numColumns={7}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            if (!item) return <View style={styles.emptyDay} />;
                            const isSelectedAndToday = selectedDay === item && isCurrentDay(item); // Check if the selected day is today
                            const isCurrentDayFlag = isCurrentDay(item); // Check if the item is today
                            return (
                                <TouchableOpacity
                                    style={[styles.day,
                                        selectedDay === item ? styles.selectedDay : isCurrentDayFlag ? styles.currentDay : null
                                    ]}
                                    onPress={() => {
                                        console.log(`Selected Day: ${item}`);
                                        setSelectedDay(item);
                                    }}
                                >
                                    <Text style={[styles.dayText,
                                        selectedDay === item ? styles.selectedDayText : isCurrentDayFlag ? styles.currentDayText : null
                                    ]}>{item}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </Animated.View>

            <Animated.View style={{ flex: 1, opacity: tasksAnimation, transform: [{ scale: tasksAnimation }] }}>
                {/* Bottom Part (Red Container) */}
                <View style={styles.redContainer}>
                    <Text style={styles.tasksHeader}>Selected day tasks:</Text>
                    {tasks.length > 0 ? (
                        <FlatList
                            data={tasks}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <Text style ={styles.taskText}>{item.contents}</Text>} // Adjust based on your task structure
                        />
                    ) : (
                        <Text style={styles.noTasksText}>No tasks for this day</Text>
                    )}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Change to 100% to take full width
    },
    calendarSection: {
        flex: 1,
        width: '90%',
        justifyContent: 'center', // Center the calendar section
        alignItems: 'center', // Center items within the calendar section
    },
    redContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingBottom: -30,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    navText: {
        fontSize: 20,
        color: 'white',
    },
    weekdays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 5,
    },
    weekdayText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        flex: 1,
    },
    day: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 20,
    },
    selectedDay: {
        backgroundColor: Colors.primary, // Use primary color for selected day
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    selectedDayText: {
        color: 'black',
    },
    currentDay: {
        backgroundColor: Colors.secondary, // This can be kept for other current day styles
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    currentDayText: {
        color: 'white',
    },
    dayText: {
        fontSize: 16,
        color: 'white',
    },
    emptyDay: {
        width: 40,
        height: 40,
        margin: 5,
    },
    tasksHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    taskText: {
        fontSize: 16,
        color: 'white',
        marginVertical: 5,
    },
    noTasksText: {
        fontSize: 16,
        color: Colors.secondary,
    },
});

export default Calendar;