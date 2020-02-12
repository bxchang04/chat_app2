import React, { Component } from 'react';
// import relevant components from react native

import { StyleSheet, Text, View, TextInput, Button, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends Component {

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello Screen1!</Text>
        <Button
          title="Go to Screen 2"
          onPress={() => this.props.navigation.navigate('Screen2')}
        />
      </View>
    )
  }
}
