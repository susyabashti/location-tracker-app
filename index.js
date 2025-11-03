import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import '@services/location/events.ts';
import './global.css';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
