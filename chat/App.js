import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import the screens
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// Create the navigator
const navigator = createStackNavigator({
  Screen1: { screen: Screen1 },
  Screen2: { screen: Screen2 }
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;
