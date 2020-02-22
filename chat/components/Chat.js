import React, { Component } from "react";
import { AsyncStorage, View, Platform, Text, StyleSheet, YellowBox } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";

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
      loginText: "Please wait, you are getting logged in..."
    };
  }

  componentDidMount() {
    this.getMessages();

    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({
          isConnected: true,
        })
        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged( async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          //update user state with currently active user data
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
          this.unsubscribeMessagesUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
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
    // stop listening for changes -- not in repo. No longer needed?
    this.unsubscribeMessagesUser(); //uncommented
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

   //Save messages object to Firestore
   addMessages() {
     // add a new list to the collection
     const messages = this.state.messages[0]; //in repo
     this.referenceMessages.add({
       _id: this.state.messages[0]._id,
       text: this.state.messages[0].text || '',
       createdAt: this.state.messages[0].createdAt,
       user: this.state.user,
       uid: this.state.uid
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
           messages={this.state.messages}
           onSend={messages => this.onSend(messages)}
           user={this.state.user}
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
