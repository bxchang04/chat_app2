To use expo, refer to the Expo Documentation Installation page on the Expo website.

Use npm install -g expo-cli or yarn add expo-cli --global.

To use firebase, refer to Google's Firebase documentation page on the Firebase website.

Steps to setup:
Create an account
Login
Create a Database
Create and name a collection
Input user credentials
Install and import the modules in App.js for:

React from 'react'
{ StyleSheet, Text, View } from 'react-native'
{ createAppContainer } from 'react-navigation'
{ createStackNavigator } from 'react-navigation-stack'
KeyboardSpacer from 'react-native-keyboard-spacer'
/components/Start.js

KeyboardSpacer from 'react-native-keyboard-spacer';
React, { Component } from 'react';
{ StyleSheet, Text, TextInput, Alert, Button, View, ImageBackground, TouchableOpacity } from 'react-native';
/components/Chat.js

KeyboardSpacer from 'react-native-keyboard-spacer';
React, { Component } from "react";
{ StyleSheet, View, Text, Platform, AsyncStorage } from "react-native";
{ GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
NetInfo from "@react-native-community/netinfo";
MapView from "react-native-maps";
CustomActions from './CustomActions'; also include
const firebase = require('firebase');
require('firebase/firestore');
/components/CustomActions.js

React, { Component } from "react";
PropTypes from "prop-types";
{ StyleSheet, Text, View, TouchableOpacity } from "react-native";
firebase from "firebase";
"firebase/firestore";
* as Permissions from "expo-permissions";
* as ImagePicker from "expo-image-picker";
* as Location from "expo-location";
