// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {decode, encode} from 'base-64'

// Create the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component

export default navigatorContainer;

//check this
