/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './src/index';
import {name as appName} from './app.json';
import App from './src/index'
  import NavigationDrawerHeader   from './src/screens/NavigationDrawerHeader.js'
 import   Home   from './src/screens/home/Home.js'


  
AppRegistry.registerComponent(appName, () => App);
