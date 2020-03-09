import React from 'react';
import { Header } from 'react-native-elements';
import { View } from 'react-native';

export default CustomHeader = (props) => {
    const backBtn = props.backBtn && {
        leftComponent: { icon: 'chevron-left', color: '#007AFF', size: 35, onPress: () => props.navigation.goBack() }
    };

    const cameraBtn = props.cameraBtn && {
        rightComponent: { icon: 'camera-outline', type: 'material-community', color: '#000', size: 30, onPress: () => props.navigation.navigate('QRScanner') }
    }

    return (
        <View>
            <Header
                {...backBtn}
                {...cameraBtn}
                statusBarProps={{ translucent: true }}
                centerComponent={{ text: props.title, style: { color: '#000', fontSize: 18, fontWeight: 'bold' } }}
                containerStyle={{
                    backgroundColor: '#fff',
                }} />
        </View>
    );

};