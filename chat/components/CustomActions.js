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

  /**
  * Let user pick an image from the device's image library
  * @async
  *@function pickImage
  */
  pickImage = async () => {
    try{
      // get Permission to access CAMERA_ROLL
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      //only proceed if user granted permission
      if(status === 'granted') {
        // let user pick an image
        let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: 'Images',
       }).catch(error => console.log(error));

       // check if user cancelled image selection
       if (!result.cancelled) {
         //define variable of picked image and send as prop to chat
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
    } catch(err) {
        console.log(err.message);
    }
  }

  /**
  * Let user take a photo using the device
  * @async
  *@function takePhoto
  */
  takePhoto = async () => {
    try{
      // get Permission to access CAMERA_ROLL and CAMERA
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
      //only proceed if user granted permission
      if (status === 'granted') {
        // let user take a photo
        let result = await ImagePicker.launchCameraAsync().catch(error => console.log(error));

        // check if user cancelled image selection
        if (!result.cancelled) {
          //define variable of photo taken and send as prop to chat
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
    } catch(err) {
      console.log(err.message);
    }
  }

  /**
  * Let user share location using device
  * @async
  *@function getLocation
  */
  getLocation = async () => {
    try{
      // get Permission to access LOCATION
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      //only proceed if user granted permission
      if(status === 'granted') {
        // let user get position
        let result = await Location.getCurrentPositionAsync({});

        // check if user cancelled sending location
        if (result) {
          //define variable of location and send as prop to chat
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

         this.props.onSend([location]);
        }
      }
    } catch(err) {
      console.log(err.message);
    }
  }

  /**
  * Store data exchanged between users in firebase
  *@function uploadImageFetch
  */
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

  /**
  * Allow user to select and perform a custom action
  *@function onActionsPress
  */
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
