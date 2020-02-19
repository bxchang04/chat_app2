import React, { Component } from "react";
import { View, Platform, Text, StyleSheet, YellowBox } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";

//Firebase setup
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  //why add (props)?
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]); // to get rid of annoying error message
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

    this.state = {
      message: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      loginText: "Please wait, you are getting logged in..."
    };
  }

  componentDidMount() {
    //differs from repo
    this.referencemessageUser = null;
    this.referencemessage = firebase.firestore().collection('message');
    //end differ
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged( async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      // listen for collection changes for current user
      this.unsubscribeMessageUser = this.referencemessage.onSnapshot(this.onCollectionUpdate);
      //update user state with currently active user data
      this.setState({
        user: {
          _id: user.uid,
          name: this.props.navigation.state.params.name,
          avatar: "https://placeimg.com/140/140/any"
        },
        loginText: "Hello there!",
      });
    });

    // create a reference to the active user's documents (message) -- is this needed? Not in repo. Commented out because in chat app, user needs to see everyone's message.
    this.referencemessage = firebase.firestore().collection('message').where("uid", "==", this.state.uid); //collection name differs, order differs too
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes -- not in repo. No longer needed?
    this.unsubscribeMessageUser(); //uncommented
  }

  // handle send actions:
  onSend(message = []) {
    this.setState(
      previousState => ({
        message: GiftedChat.append(previousState.message, message)
      }),
      () => {
        this.addMessage();
      }
    );
  }

   // Passes user name given in the start screen to the title
   static navigationOptions = ({ navigation }) => {
     return {
       title: navigation.state.params.name,
     };
   };

   //Save message object to Firestore
   addMessage() {
     // add a new list to the collection
     const message = this.state.message[0]; //in repo
     this.referencemessage.add({
       _id: message._id,
       text: message.text,
       // createdAt: message.createdAt,
       user: message.user,
       uid: this.state.uid, // uncommented
     });
   }

   //handle changes of data
   onCollectionUpdate = (querySnapshot) => {
     const message = [];
     // go through each document
     querySnapshot.forEach((doc) => {
       // get the QueryDocumentSnapshot's data
       let data = doc.data();
       message.push({
         _id: data._id,
         text: data.text,
         // createdAt: data.createdAt.toDate(),
         user: data.user
       });
     });
     this.setState({
       message,
    });
   }

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

  render() {
   return (
     <View style={{
       flex: 1,
       justifyContent: 'center',
       backgroundColor: this.props.navigation.state.params.color}}
     >
       <Text>{this.state.loggedInText}</Text>
       <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
         message={this.state.message}
         onSend={message => this.onSend(message)}
         user={{_id: 1,}}
       />
       {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
     </View>
   )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  }
});
