// index.js — gesture-handler must load before other imports (RN docs)
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App'; // App includes navigation
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
