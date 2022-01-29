import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Button } from 'react-native';

class test extends Component {


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.item} />
                <View style={styles.item} />
            </View>
        )
    }
}
export default test

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'row',
    },
    item: {
        borderWidth: 1,
        height: 150, width: 150
    }
});