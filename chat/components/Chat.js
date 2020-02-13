import React, { Component } from 'react';
// import relevant components from react native

import { StyleSheet, Text, View, TextInput, Button  } from 'react-native';

export default class Chat extends Component {

  // Passes user name given in the start screen to the title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  render() {
    return (
      <View style={{flex: 1,
          justifyContent: 'center',
          backgroundColor: this.props.navigation.state.params.color}}
      >
      </View>
    )
  }
}
