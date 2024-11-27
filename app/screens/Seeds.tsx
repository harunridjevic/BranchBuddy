import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Colors } from '../colors'
import SeedCard from './SeedCard'

const Seeds = () => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={[styles.text, styles.textLeft]}>Recent seeds</Text>
                <TouchableOpacity>
                    <Text style={[styles.text, styles.textRight]}>See all</Text>
                </TouchableOpacity>

            </View>
            {/* Navigation */}
            <ScrollView horizontal style={styles.scroll}>
                <SeedCard />
                <SeedCard />
                <SeedCard />
                <SeedCard />
                <SeedCard />
                <SeedCard />
                <SeedCard />
            </ScrollView>

        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Keep the items inline horizontally
        justifyContent: 'space-between', // Distribute space between the items
        alignItems: 'center', // Vertically align the items in the center
        width: '100%', // Ensure the container takes full width
        paddingHorizontal: 10, // Add horizontal padding to prevent text from touching the edges

    },
    text: {
        color: 'white',
        fontSize: 18,
        margin: 20,
    },
    textLeft: {
        textAlign: 'left',
        color: Colors.secondary
    },
    textRight: {
        textAlign: 'right',
        color: Colors.tertiary
    },
    scroll: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        position: 'relative',
        marginTop:-20
    }
});

export default Seeds;