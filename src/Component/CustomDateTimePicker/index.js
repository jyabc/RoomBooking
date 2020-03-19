import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default class CustomDateTimePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    onChange = (selected) => {
        this.props.onChange(selected);
    };

    showPicker = () => {
        this.setState({
            show: true,
        });
    };

    hidePicker = () => {
        this.setState({
            show: false,
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
                <DateTimePickerModal
                    onConfirm={(res) => this.onChange(res)}
                    isVisible={show}
                    onCancel={() => this.hidePicker()}
                    minimumDate={this.props.mode == 'date' ? new Date() : null}
                    value={this.props.date}
                    mode={this.props.mode}
                    is24Hour={false}
                    display={this.props.display || 'default'}
                    minuteInterval={30}
                    headerTextIOS={'Pick a ' + this.props.mode}
                />
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