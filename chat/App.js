import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
  apiKey: "AIzaSyANcG9zt8msq61vbVyFeAInu7AvegFD8og",
  authDomain: "test-30f18.firebaseapp.com",
  databaseURL: "https://test-30f18.firebaseio.com",
  projectId: "test-30f18",
  storageBucket: "test-30f18.appspot.com",
  messagingSenderId: "320788073310"
});

this.referenceShoppingLists = firebase.firestore().collection('shoppinglists/list1');

this.state = {
  lists: [],
};

componentDidMount() {
 this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)

/*
 this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
   if (!user) {
     await firebase.auth().signInAnonymously();
   }

   //update user state with currently active user data
   this.setState({
     uid: user.uid,
     loggedInText: 'Hello there',
   });
 });
 */

 // listen for collection changes for current user - delete above
 // this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);

}

componentWillUnmount() {
 this.unsubscribe();
}

onCollectionUpdate = (querySnapshot) => {
  const lists = [];
  // go through each document
  querySnapshot.forEach((doc) => {
    // get the QueryDocumentSnapshot's data
    var data = doc.data();
    lists.push({
      name: data.name,
      items: data.items.toString(),
    });
  });
  this.setState({
    lists,
  });
};

addList() {
  this.referenceShoppingLists.add({
    name: 'TestList',
    items: ['eggs', 'pasta', 'veggies'],
    //Last but not least, you need to add the user ID with every new list that gets saved to your database. This “assigns” that list to the user, almost like a name tag. To include this ID, simply add a new field, uui, to your addList() function:

    // uid: this.state.uid,
  });
}



//Add this loggedInText to your state in the constructor() function and use setState() to update the message once you’ve received the user object. To display the message to the user, simply add a new <Text> element inside render():

// <Text>{this.state.loggedInText}</Text>

//Great! The user is currently logged in, but how do you ensure they only see lists that belong to them? You first need to modify your snapshot query to only display lists that belong to the current user. This can be done within the onAuthStateChanged() but beneath setState(). Rather than creating a reference to all the documents within your collection, like you did before, you now only want to reference ones that belong to the current user. Take a look at the code below:

// create a reference to the active user's documents (shopping lists)
this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);



<FlatList
  data={this.state.lists}
  renderItem={({ item }) =>
  <Text>{item.name}: {item.items}</Text>}
/>

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
