/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AppRoutes from './Javascript/App/App';

export default class OMDbApp extends Component {
  render() {
    return (
      <AppRoutes />
    );
  }
}

AppRegistry.registerComponent('OMDbApp', () => OMDbApp);
