import React from "react";
import { StyleSheet, View } from "react-native";

export default function Card(props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                { props.children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        elevation: 3,
        backgroundColor: '#008000',
        marginHorizontal: 4,
        marginVertical: 6,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 18,
        marginVertical: 10,
        width: '85%',
    }
})