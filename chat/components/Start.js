/**
 * @description start.js is the starting page of this app.
 */

import React, { Component } from 'react';
// import relevant components from react native

import { StyleSheet, Text, View, TextInput, Button, ImageBackground, TouchableOpacity } from 'react-native';
import KeyboardSpacer from "react-native-keyboard-spacer";

// Starting Screen
export default class Start extends Component {

  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  render() {
     return (
       <ImageBackground source={require('../assets/background_image.png')} style={styles.bgdImage}>
         <View style={styles.containerBlank}>
         </View>
         <Text style={styles.title}>My Chat App</Text>
         <View style={styles.containerBlank}>
         </View>
         <View style={styles.container}>
           <View style={styles.tContainer}>
             <View style={styles.containerTriFlex}>
               <TextInput
                 style={styles.nameInput}
                 onChangeText={(name) => this.setState({ name })}
                 value={this.state.name}
                 placeholder='Your name'
               />
             </View>
             <Text style={[styles.chooseBgdColor]}>Choose Background Color:</Text>
             <View style={styles.color_buttonContainer}>
               <TouchableOpacity style={[styles.color_Button, styles.black]} onPress={() => this.setState({ color: '#090C08' })}/>
               <TouchableOpacity style={[styles.color_Button, styles.gray]} onPress={() => this.setState({ color: '#474056' })}/>
               <TouchableOpacity style={[styles.color_Button, styles.blue]} onPress={() => this.setState({ color: '#8A95A5' })}/>
               <TouchableOpacity style={[styles.color_Button, styles.green]} onPress={() => this.setState({ color: '#B9C6AE' })}/>
             </View>
             <Button
               title='Start Chatting'
               style={[styles.containerTriFlex, styles.startChatButton]}
               onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
             />
           </View>
         </View>
         <View style={styles.containerBlank}>
         </View>
       </ImageBackground>

     );
  }
}
/**
* styling section
*/
const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 80,
    flex: 1,
  },
  bgdImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    backgroundColor: 'rgba(0,0,0,0.1)',
    flex: 0.5,
    opacity: 0.5
  },
  chooseBgdColor: {
    opacity: 1.0,
    color:'#757083'
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '44%',
    width: '88%',
    padding: 12,
    flex: 0.9
  },
  containerTriFlex: {
    flex: 1,
  },
  tContainer: {
    flex: 1,
    margin: 10,
  },
  containerBlank: {
    flex: 0.09
  },
  containerBottom: {
    flex: 1,
    justifyContent: 'center',
  },
  color_buttonContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  color_Button: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 25,
  },
  startChatButton: {
    backgroundColor: '#757083',
  },
  black: {
    backgroundColor: '#090C08',
  },
  gray: {
    backgroundColor: '#474056',
  },
  blue: {
    backgroundColor: '#8A95A5',
  },
  green: {
    backgroundColor: '#B9C6AE',
  },

});
