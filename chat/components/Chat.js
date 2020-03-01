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
  //why add (props)?
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
      loginText: "Please wait, you are getting logged in...",
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
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.name,
              avatar: ''
            },
            loginText: "Hello there!",
          });

          // create a reference to the active user's documents (messages)
          this.referenceMessages = firebase.firestore().collection('messages')

          // listen for collection changes for current user
          this.unsubscribeMessageUser = this.referenceMessageUser.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
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

  // handle send actions:
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  }

  // save messages
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

   // Passes user name given in the start screen to the title
   static navigationOptions = ({ navigation }) => {
     return {
       title: navigation.state.params.name,
     };
   };

   // Save messages object to Firestore
  addMessages() {
    // Add a new list to the collection
    const messages = this.state.messages[0]; //in repo
    this.referenceMessages.add({
     _id: messages._id,
     text: messages.text || '',
     createdAt: messages.createdAt,
     user: messages.user,
     // uid: messages.uid,
     image: messages.image || null,
     location: messages.location || null,
  });
  }

   // handle changes of data and store in state lists to render in view
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

  // disable message input while offline
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

  //test this
  get user() {
    return {
       _id: this.state.uid,
       name: this.props.navigation.state.params.name,
       // avatar: 'https://scontent.fbed1-1.fna.fbcdn.net/v/t1.0-9/81254713_10107625749857985_6078564461231210496_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=yw6KZT8MqFYAX_08saR&_nc_ht=scontent.fbed1-1.fna&oh=9aac078e596649011c6192f755ced32f&oe=5EB51954'
       avatar: ''
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
