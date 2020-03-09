import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default ListItem = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.nameText}>{props.roomName}</Text>
                    {
                        (props.isAvailable) ?
                            <Text style={styles.availableText}>Available</Text> :
                            <Text style={styles.notAvailableText}>Not Available</Text>
                    }
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Level {props.roomLevel}</Text>
                    <Text style={styles.text}>{props.roomCapacity} Pax</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4F4F4F'
    },
    availableText: {
        color: '#66C165',
        fontStyle: 'italic'
    },
    notAvailableText: {
        color: '#A5A5A5',
        fontStyle: 'italic'
    },
    text: {
        color: '#646464'
    }
});
