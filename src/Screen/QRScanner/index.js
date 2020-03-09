
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { CommonActions } from '@react-navigation/native';

export default class QRScanner extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasResult: false,
        }
    }

    readQR = (res) => {

        if (this.state.hasResult) {
            return;
        }

        if (res.hasOwnProperty('data')) {

            this.setState({
                hasResult: true
            }, () => {
                return this.props.navigation.dispatch(CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'Home',
                        },
                        {
                            name: 'QRResult',
                            params: {
                                url: res.data,
                            },
                        },
                    ]
                }));
            });
        }
    }

    render() {

        return (
            <View style={styles.container}>
                {!this.state.hasResult && <RNCamera
                    style={styles.container}
                    type={RNCamera.Constants.Type.back}
                    captureAudio={false}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={(e) => this.readQR(e)} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});