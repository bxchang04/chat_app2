import React, { Component } from 'react';
// import relevant components from react native

import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';

// Starting Screen
export default class Start extends Component {

  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  render() {
     return (
       <ImageBackground source={require('../assets/chatBackground.png')} style={styles.backgroundImage}>
           <Text style={styles.title}>The Chat App</Text>
           <View style={styles.container}>
             <View style={styles.triContainer}>
                   <View style={styles.containerTriFlex}>
                       <TextInput
                           style={styles.yourNameInput}
                           onChangeText={(name) => this.setState({ name })}
                           value={this.state.name}
                           placeholder='Your name'
                       />
                   </View>
                   <Text>Pick your background!</Text>
                   <View style={styles.colorButtonContainer}>
                       <TouchableOpacity style={[styles.colorButton, styles.brown]} onPress={() => this.setState({ color: '#99847B' })}></TouchableOpacity>
                       <TouchableOpacity style={[styles.colorButton, styles.red]} onPress={() => this.setState({ color: '#CB8C9D' })}></TouchableOpacity>
                       <TouchableOpacity style={[styles.colorButton, styles.blue]} onPress={() => this.setState({ color: '#B8CECD' })}></TouchableOpacity>
                       <TouchableOpacity style={[styles.colorButton, styles.yellow]} onPress={() => this.setState({ color: '#DAE362' })}></TouchableOpacity>
                   </View>
                   <Button
                       title='Start Chatting'
                       color='#CFB8B9'
                       style={[styles.containerTriFlex, styles.startChattingButton]}
                       onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                   />
               </View>
           </View>
       </ImageBackground>

     );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 100,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  yourNameInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    backgroundColor: 'rgba(0,0,0,0.1)',
    flex: 0.5,
    marginTop: 5,
  },
  triContainer: {
    flex: 1,
    margin: 10,
  },
  containerTriFlex: {
    flex: 3,
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '44%',
    width: '88%',
    padding: 10,
  },
  colorButtonContainer: {
    flexDirection: 'row',
    flex: 3,
  },
  colorButton: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 25,
  },
  startChattingButton: {
    backgroundColor: '#CFB8B9',
    width: '88%',
  },
  brown: {
    backgroundColor: '#99847B',
  },
  red: {
    backgroundColor: '#CB8C9D',
  },
  blue: {
    backgroundColor: '#B8CECD',
  },
  yellow: {
    backgroundColor: '#DAE362',
  },

});
