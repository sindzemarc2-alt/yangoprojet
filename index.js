/**
 * @format
 */
import 'react-native-gesture-handler';
import { LogBox, AppRegistry } from 'react-native';

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
LogBox.ignoreLogs(['deprecated', 'RNFB']);

import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
