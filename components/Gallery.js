import React from 'react';
import Gallery from "react-native-photo-browser";

// TODO: Remove when fixed in react-native-photo-browser
import { LogBox } from 'react-native'

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Animated: `useNativeDriver` was not specified',
])

class GalleryScreen extends React.Component {

  render() {
    const mediaList = this.props.uris.map((uri) => ({
      photo: uri,
    }))
    return (
      <Gallery mediaList={mediaList} startOnGrid={true}/>
    );
  }
}

export default GalleryScreen
