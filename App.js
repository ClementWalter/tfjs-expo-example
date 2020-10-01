import { AppLoading } from 'expo'
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset'
import Swiper from 'react-native-swiper'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Gallery from './components/Gallery';
import * as tf from "@tensorflow/tfjs"
import CameraScreen from './components/Camera';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    uris: []
  };

  handleSnapshot = (uris) => this.setState({uris: [...this.state.uris, ...uris]})

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <Swiper loop={false} showsPagination={false}>
          <View style={styles.container}>
            <CameraScreen handleSnapshot={this.handleSnapshot}/>
          </View>
          <View style={styles.container}>
            <Gallery uris={this.state.uris}/>
          </View>
        </Swiper>
      )
    }
  }

  _loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/splash.png'),
        require('./assets/icon.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
      }),
      tf.ready(),
    ])
  };

  _handleLoadingError = error => (console.warn(error));

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6E00FF',
  },
});
