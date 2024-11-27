import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const SeedCard = () => {
    return (
        <View style={styles.container}>
            {/* Image component for background */}
            <Image 
                source={require('../assets/default_card_bg.png')} // Replace with your image path
                style={styles.image} // Apply image style
                resizeMode="contain" // Make sure the image fits inside without cropping
            />
            <Text style={[styles.text, styles.top_text]}>Becoming rich</Text>
            <Text style={[styles.text, styles.description_text]}>1 hour of listening to Harun's financial advice</Text>
            <Image 
                source={require('../assets/grown_tree.png')}
                style={styles.tree}
            />
            <Text style={[styles.text, styles.day_text]}>Day 500</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 330,
        marginLeft: 20,
        marginTop: 20,
        marginRight: 0,
        height: '60%',
        borderRadius: 40,
        overflow: 'hidden', // Ensures the content stays inside the rounded corners
        position: 'relative', // Allow absolute positioning of the image
    },
    image: {
        width:'100%',
        height:'100%', // Make the image fill the container
        borderRadius: 40, // Apply rounded corners to the image as well
        resizeMode: 'contain', // Prevent image cropping and keep aspect ratio
        position: 'absolute'
    },
    text: {
        color: 'white',
        fontSize: 18,
        zIndex: 1, // Ensure the text is above the image
    },
    top_text:{
        marginTop:40,
        marginLeft:30,
        fontWeight:'800',
        fontSize: 22,
        color:'black'
    },
    description_text:{
        marginLeft:30,
        color:'black',
        marginTop:10
    },
    tree:{
        width:'80%',
        height:'80%',
        resizeMode: 'contain',
        position: 'absolute',
        bottom: -20,
        right:-10
    },
    day_text:{
        position:'absolute',
        color: 'black',
        fontWeight: '900',
        bottom:0,
        left:0,
        margin:30,
        fontSize:20
    }
});

export default SeedCard;
