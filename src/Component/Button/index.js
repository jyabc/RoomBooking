import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default Button = (props) => {

    const blue = props.blue && { backgroundColor: '#4E77E0' };
    const gray = props.gray && { backgroundColor: '#434A54' };
    
    return (
        <TouchableOpacity onPress={props.onPress} style={[props.style, styles.btn, {...blue}, {...gray}]}>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    btn: {
        padding: 12,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});
