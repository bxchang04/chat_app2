import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// import Firebase to store data
const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {

  pickImage = async () => {

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if(status === 'granted') {
     let result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: 'Images',
     }).catch(error => console.log(error));

     if (!result.cancelled) {
       const image =
        {
           _id: "",
           text: "",
           createdAt: new Date(),
           user: {
             _id: "",
             name: "",
             avatar: "",
           },
           image: result.uri
         };
       this.props.onSend([image]);
      }
    }
  }

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync().catch(error => console.log(error));

      if (!result.cancelled) {
        const image =
         {
            _id: "",
            text: "",
            createdAt: new Date(),
            user: {
              _id: "",
              name: "",
              avatar: "",
            },
            image: result.uri
          };
        this.props.onSend([image]);
       }
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        const location =
          {
            _id: "",
            createdAt: new Date(),
            user: {
              _id: "",
              name: "",
              avatar: "",
            },
            location: {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
            },
          }

       this.props.onSend([location]); // expects a list of messages
     }
   }
  }

  // store data exchanged between users in firebase
  uploadImageFetch = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const imgBefore = uri.split("/");
      const imgName = imgBefore[imgBefore.length - 1];

      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imgName}`);

      const snapshot = await ref.put(blob);
      blob.close();
      const imgUrl = await snapshot.ref.getDownloadURL();
      return imgUrl;
    } catch (error) {
      console.log(error.message);
    }
  }

  onActionsPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
        }
      },
    );
  };

  render() {

    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionsPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
