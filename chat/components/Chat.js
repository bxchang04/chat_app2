import React, { Component } from 'react';
// import relevant components from react native

import { StyleSheet, Text, View, TextInput, Button, ImageBackground, TouchableOpacity  } from 'react-native';

export default class Chat extends Component {

  // Passes user name given in the start screen to the title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  render() {
    return (
      <ImageBackground
        source={require("../assets/background_image.png")}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      </View>
    )
  }
}
