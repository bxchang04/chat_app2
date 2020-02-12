import React, { Component, Alert, Button, ScrollView } from 'react';
import Start from './components/Start';
import Chat from './components/Screen2';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

  export default class App extends React.Component {
    constructor(props) {
     super(props);
     this.state = { text: '' };
  }

  // alert the user input
  alertMyText (input = []) {
   Alert.alert(input.text);
  }

  // export default class App extends React.Component {
   // Create the navigator
  const navigator = createStackNavigator({
   Start: { screen: Start },
   Chat: { screen: Chat }
  });

  const navigatorContainer = createAppContainer(navigator);
  // Export it as the root component
  export default navigatorContainer;

  const onpress = this.props.navigation.navigate('Chat', { name: this.state.name });
