import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// Create the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component

export default navigatorContainer;

const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
  apiKey: "AIzaSyANcG9zt8msq61vbVyFeAInu7AvegFD8og",
  authDomain: "test-30f18.firebaseapp.com",
  databaseURL: "https://test-30f18.firebaseio.com",
  projectId: "test-30f18",
  storageBucket: "test-30f18.appspot.com",
  messagingSenderId: "320788073310"
});
