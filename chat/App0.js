//migrate code into Chat.js
//Get test code to work
//Create a new Firestore database. Remember to use the same values in your documents as there are in the message object for Gifted Chat.


import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/*
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// Create the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});
const navigatorContainer = createAppContainer(navigator);
// Export it as the root component

export default navigatorContainer;
*/

const firebase = require('firebase');
require('firebase/firestore');

class App extends React.Component {

  constructor() {
    super();
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

    this.referenceShoppinglistUser = null;
    // this.referenceShoppinglistUser = firebase.firestore().collection('users'); //check this. Is it needed?

    this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');
    // this.referenceShoppingLists = firebase.firestore().collection('users/messages'); // create new collection in firebase
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
    };
  }

  //Write chat messages to state messages when onSnapshot() gets fired (i.e., whenever the collection changes)
  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name, //for shopping list
        items: data.items.toString(), //for shopping list
        // name: data.name, //uncomment once above works, then delete above and shopping list code
        // items: data.text.toString(), //uncomment once above works, then delete above and shopping list code
      });
    });
    this.setState({
      lists,
   });
  }

  //Save user messages using Firestore
  /*
  addMessage() {
    // add a new list to the collection
    this.referenceShoppingLists.add({
      name: 'TestList', //change to username
      items: ['eggs', 'pasta', 'veggies'], //change to message not array
      uid: this.state.uid,
    });
  }
*/
    //Delete this once not needed
    addList() {
      // add a new list to the collection
      this.referenceShoppingLists.add({
        name: 'TestList', //change to username
        items: ['eggs', 'pasta', 'veggies'], //change to message not array
        uid: this.state.uid,
      });
    }

  //change addList to addMessaeg below?. Learn how to comment out JSX for react native (how to comment? * /\ * /  not working)
  /*
  <Text style={styles.item}>{item.name}: {item.text}</Text>}
  */
  render() {

    return (
      <View style={styles.container}>

        <Text>{this.state.loggedInText}</Text>

        <Text style={styles.text}>All Shopping lists</Text>
        <FlatList
            data={this.state.lists}
            renderItem={({ item }) =>
              <Text style={styles.item}>{item.name}: {item.items}</Text>}
          />

        <Button
          onPress={() => {
            this.addList();
          }}
          title = "Add something"
        />
      </View>
    );
  }

  componentDidMount() {
    //Authenticate users anonymously using Firebase.
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((async user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });

      //Get user messages from Firestore
      // create a reference to the active user's documents (shopping lists)
      this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);
      // listen for collection changes for current user
      this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);



    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeListUser();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});

export default App;
