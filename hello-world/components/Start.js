import React, { Component, Alert, Button, ScrollView } from 'react';
import { View, Text } from 'react-native';

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

export default class App extends React.Component {
  constructor(props) {
   super(props);
   this.state = { name: '' };
  }

  render() {
    return (
      <ImageBackground source={..assets/Background_Image.png} style={{width: '100%', height: '100%'}}>
        <View style={{flex:1, justifyContent:'center'}}>
         <TextInput
           title="Your name" {/* check this*/}
           style={{height: 40, borderColor: 'gray', borderWidth: 1}}
           onChangeText={(name) => this.setState({name})}
           value={this.state.name}
           placeholder='Type here ...'
         />
         <Button
           title="Go to Chat"
           onPress={() => {
             this.props.navigation.navigate('Chat', { name: this.state.name })
           }}
         />
         </View>
      </ImageBackground>
    );
  }
}
