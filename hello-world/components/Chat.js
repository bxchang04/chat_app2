import React, { Component, Alert, Button, ScrollView } from 'react';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Display user's name in navigation bar
static navigationOptions = ({ navigation }) => {
  return {
    title: navigation.state.params.name,
  };
};

render() {
  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <Text navigationOptions = {this.navigationOptions}> </Text>
    </View>

  )
}
