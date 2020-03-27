import React, { Component } from "react";
import { AsyncStorage, View, Platform, Text, StyleSheet, TouchableOpacity, YellowBox } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

//Firebase setup
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]); // to get rid of annoying error messages
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyANcG9zt8msq61vbVyFeAInu7AvegFD8og",
        authDomain: "test-30f18.firebaseapp.com",
        databaseURL: "https://test-30f18.firebaseio.com",
        projectId: "test-30f18",
        storageBucket: "test-30f18.appspot.com",
        messagingSenderId: "320788073310"
      });
    }

    this.referenceMessagesUser = null;

    this.state = {
      isConnected: false,
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      uid: 0,
      loginText: `Please wait, you are getting logged in...`,
      image: null,
      location: null,
      uri: null
    };
  }

  componentDidMount() {
    this.getMessages();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.setState({
          isConnected: true,
        })
        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged( async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          // update user state with currently active user data
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.name,
            },
            loginText: `Hello there!`,
          });

          // create a reference to the active user's documents (messages)
          this.referenceMessages = firebase.firestore().collection('messages')

          // listen for collection changes for current user and sort by time created
          this.unsubscribeMessagesUser = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
          // this.unsubscribeMessagesUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        })
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeMessagesUser();
  }

  /**
  * When offline, messages are stored in async storage
  * @function getMessages
  * @return messages
  */
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * @function onSend
   * @param {*} messages - message includes: {message/image/location}
   * @returns {state} updates state with a message
   */
  onSend(messages = []) {
    console.log(messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  }

  /**
  * Save messages to asyncStorage
  * @async
  * @function saveMessagetoStorage
  * @return {Promise<AsyncStorage>} message in asyncStorage
  */
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Delete messages from asyncStorage. Currently not used.
   * @async
   * @function deleteMessages
   * @param {none}
   */
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

   // Pass user name given in the start screen to the title
   static navigationOptions = ({ navigation }) => {
     return {
       title: navigation.state.params.name,
     };
   };

   /**
    * Add the message to firebase database
    * @function addMessage
    * @param {number} _id
    * @param {string} text
    * @param {date} createdAt
    * @param {string} user
    * @param {image} image
    * @param {number} geo - coordinates
    */
    addMessages() {
    // Add a new list to the collection
    const messages = this.state.messages[0]; //in repo
    this.referenceMessages.add({
     _id: messages._id,
     text: messages.text || '',
     createdAt: messages.createdAt,
     user: messages.user,
     image: messages.image || null,
     location: messages.location || null,
  });
  }

  /**
   * Update the state of the message with the text input
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text - text message
   * @param {string} image - uri
   * @param {number} location - geo coordinates
   * @param {string} user
   * @param {date} createdAt - date/time of message creation
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
     // get the QueryDocumentSnapshot's data
     let data = doc.data();
     messages.push({
       _id: data._id,
       text: data.text,
       createdAt: data.createdAt.toDate(),
       user: data.user,
       image: data.image || null,
       location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  }

  // change color of message bubbles
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

  /**
   * Removes toolbar if internet not detected
   * @function renderInputToolbar
   * @param {*} props
   * @returns {InputToolbar}
   */
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  // '+' button to take picture/upload picture/send location
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
     const { currentMessage } = props;
     if (currentMessage.location) {
       return (
           <MapView
             style={{width: 150,
               height: 100,
               borderRadius: 13,
               margin: 3}}
             region={{
               latitude: currentMessage.location.latitude,
               longitude: currentMessage.location.longitude,
               latitudeDelta: 0.0922,
               longitudeDelta: 0.0421,
             }}
           />
       );
     }
     return null;
   }

  get user() {
    return {
       _id: this.state.uid,
       name: this.props.navigation.state.params.name,
       avatar: 'https://placeimg.com/140/140/any'
    };
  }

  render() {
   return (
     <View style={{
       flex: 1,
       justifyContent: 'center',
       backgroundColor: this.props.navigation.state.params.color}}
     >
       <Text>{this.state.loginText}</Text>
       <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
         renderInputToolbar={this.renderInputToolbar.bind(this)}
         messages={this.state.messages}
         onSend={messages => this.onSend(messages)}
         user={this.state.user}
         renderActions={this.renderCustomActions}
         renderCustomView={this.renderCustomView}
         user={this.user}
       />
       {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
     </View>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  }
});
