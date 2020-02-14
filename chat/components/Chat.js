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
    YellowBox.ignoreWarnings(["Setting a timer"]);
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
      messages: [],
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
    // this.referenceMessagesUser = null;
    this.referenceMessages = firebase.firestore().collection('message');
    //end differ
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
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

    // create a reference to the active user's documents (messages) -- is this needed? Not in repo.
    // this.referenceMessages = firebase.firestore().collection('message').where("uid", "==", this.state.uid); //collection name differs, order differs too
    // listen for collection changes for current user
    this.unsubscribeMessageUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes -- not in repo. No longer needed?
    // this.unsubscribeMessageUser();
  }

  // handle send actions:
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
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
     const message = this.state.messages[0]; //in repo
     this.referenceMessages.add({
       _id: message._id,
       text: message.text,
       createdAt: message.createdAt,
       user: message.user
       // uid: this.state.uid, // why comment this out? Not in repo
     });
   }

   //handle changes of data
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
         user: data.user
       });
     });
     this.setState({
       messages,
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

   //why is GiftedChat user = _id: 1?
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
         messages={this.state.messages}
         onSend={messages => this.onSend(messages)}
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
