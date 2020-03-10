import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import Button from 'Component/Button';

export default class ModalOption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: null, 
            option: null,
        };
    }

    updateOption = (option) => {
        this.setState({
            checked: option
        });
    }

    onPress = (isReset = false) => {
        if (isReset) {
            this.setState({
                option: null,
                checked: null
            }, () => {
                this.props.action();
            });
        } else {
            this.setState({
                option: this.state.checked,
            }, () => {
                this.props.action(this.state.option)
            });
        }
    }

    onSwipeComplete = () => {
        this.setState({
            checked: this.state.option,
        }, ()=>{
            this.props.hideModal();
        });
    }

    render() {

        const { checked, option } = this.state;
        return (
            <View>
                <Modal
                    isVisible={this.props.isVisible}
                    backdropColor={'rgba(255,255,255,0)'}
                    swipeDirection='down'
                    onSwipeComplete={() => this.onSwipeComplete()}
                    style={styles.modalStyle}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{this.props.title || ''}</Text>

                        {this.props.options.length > 0 && this.props.options.map((i, k) => {
                            return (<View style={styles.optionRow} key={k}>
                                <Text style={styles.optionText}>{i}</Text>
                                <TouchableWithoutFeedback onPress={() => this.updateOption(i)}>
                                    <Icon name={(checked != i) ? 'circle-outline' : 'checkbox-marked-circle-outline'} type='material-community' color='#AAB2BD' />
                                </TouchableWithoutFeedback>
                            </View>);
                        })}

                        <View style={styles.btnContainer}>
                            <Button text='Reset' style={{ flex: 0.25 }} gray onPress={() => this.onPress(true)} />
                            <Button text='Apply' style={{ flex: 0.75 }} blue onPress={() => this.onPress()} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    modalStyle: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        flex: 0.8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
        borderColor: '#a0a0a0',
        borderWidth: 1,
        //shadows
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    title: {
        borderTopWidth: 3,
        borderTopColor: '#CFD1D3',
        paddingVertical: 20,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    btnContainer: {
        height: 70,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 5
    },
    optionText: {
        fontSize: 16
    }
});