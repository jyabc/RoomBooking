import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Button from 'Component/Button';

export default class QRResult extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: this.props.route.params.url
        }
    }

    onError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        const errUrl = nativeEvent.url;

        // nativeEvent.code == -2
        if (nativeEvent.description.indexOf('INTERNET_DISCONNECTED') > -1) {
            return Alert.alert('Error', 'No network connection', [
                { text: 'OK', onPress: () => this.props.navigation.goBack() },
            ],
                { cancelable: false });
        }

        // nativeEvent.code == -10
        // handling for intent url since the default webview not supporting
        if (errUrl.indexOf('intent://') > -1) {
            const fallback_url = errUrl.split(';')[4].split('=')[1];

            this.setState({
                url: fallback_url
            });
        }
    }

    render() {
        const { url } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <CustomHeader backBtn title='Book a Room' navigation={this.props.navigation} />

                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: url }}
                        originWhitelist={['*']}
                        startInLoadingState={true}
                        onError={(e) => this.onError(e)}
                    />
                </View>
                <View>
                    <Button text='Back to Home' onPress={() => this.props.navigation.goBack()} />
                </View>
            </View>
        );
    }
}