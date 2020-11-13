import 'react-native-gesture-handler';

import React from 'react';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Flatlist from './components/Flatlist';

import { Text, StatusBar, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

//Le language qui ressemble à du html est du 
export default class App extends React.Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Flatlist" component={Flatlist} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
