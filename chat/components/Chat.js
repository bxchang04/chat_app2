import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { View, Platform, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Text } from 'react-native'
export default class Chat extends Component {

  state = {
    messages: [],
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
         {
          _id: 2,
          text: `Welcome ${this.props.navigation.state.params.name} to My Chat!`,
          createdAt: new Date(),
          system: true,
         },
      ]
    })
  }

  onSend(messages = []) {
   this.setState(previousState => ({
     messages: GiftedChat.append(previousState.messages, messages),
   }))
  }

   // Passes user name given in the start screen to the title
   static navigationOptions = ({ navigation }) => {
     return {
       title: navigation.state.params.name,
     };
   };

  renderBubble(props) {
   return (
   <Bubble
     {...props}
     wrapperStyle={{
       right: {
         backgroundColor: '#000'
       }
     }}
   />
   )
  }

   //fix background color later?
  render() {
   return (
     <View style={{
       flex: 1,
       justifyContent: 'center',
       backgroundColor: this.props.navigation.state.params.color}}
     >
       <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
         messages={this.state.messages}
         onSend={messages => this.onSend(messages)}
         user={{
           _id: 1,
         }}
       />
       {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
     </View>
   )
  }
}
