import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class CustomDateTimePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    onChange = (event, selected) => {
        this.setState({
            show: false
        }, ()=>{
            this.props.onChange(selected);
        });
    };


    showPicker = () => {
        this.setState({
            show: true,
        });
    };

    render() {
        const { show } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.label}</Text>
                <TouchableOpacity onPress={() => this.showPicker()}>
                    <Text>
                        {this.props.placeholder}
                    </Text>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        minimumDate={new Date()}
                        value={this.props.date}
                        mode={this.props.mode}
                        is24Hour={false}
                        display={this.props.display || 'default'}
                        onChange={(e, res) => this.onChange(e, res)}
                        minuteInterval={30}
                    />
                )}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    text: {
        color: '#a0a0a0',
    }
});