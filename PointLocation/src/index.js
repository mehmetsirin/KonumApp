import * as  React from 'react'
import Home from './screens/home/Home.js';
import App from './App'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function AppNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator initial="App">
                <Stack.Screen name="App" component={App} options={{hide: true}} />
                <Stack.Screen name="Home" component={Home}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}


// In App.js in a new project





