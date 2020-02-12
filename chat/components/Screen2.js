import React, { Component } from 'react';
// import relevant components from react native

import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';

// Starting Screen
export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }
  
export default class Screen2 extends Component {

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello Screen2!</Text>
      </View>
    )
  }
}
