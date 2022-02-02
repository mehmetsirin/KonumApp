import * as  React from 'react'
import { Button } from 'react-native'
import Home from './screens/home/Home.js';
import test from './screens/home/test';

import NavigationDrawerHeader from './screens/NavigationDrawerHeader.js';
import App from './App'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function AppNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{

      }}>
        {/* <Stack.Screen name="test" component={test}  /> */}
        <Stack.Screen name="App" component={App} options={{ headerShown: false }} />

        <Stack.Screen name="Home" component={Home} options={{
          title: '',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


// In App.js in a new project





