import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Screen/Home';
import QRScanner from './src/Screen/QRScanner';
import QRResult from './src/Screen/QRResult';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#fff' barStyle='dark-content' />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="QRScanner"
          component={QRScanner}
        />
        <Stack.Screen
          name="QRResult"
          component={QRResult}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
