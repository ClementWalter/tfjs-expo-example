import React from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as tf from "@tensorflow/tfjs"
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Ionicons } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import { encodeJpeg } from '../utils';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const TensorCamera = cameraWithTensors(Camera)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noPermissionsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'white',
  },
  cameraView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  camera: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height,
    zIndex: 0,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: "100%",
    height: Math.floor(0.2 * height),
    zIndex: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomBarIcon: {
    alignSelf: 'center',
  },
});

class CameraScreen extends React.Component {
  rafID;

  state = {
    cameraPermissionsGranted: false,
    isRecording: false,
  };

  allowCameraPermission = async () => {
    if (!this.state.cameraPermissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({cameraPermissionsGranted: status === 'granted'});
    }
  }

  componentDidMount = async () => {
    await this.allowCameraPermission();
  };

  onPressRadioIn = () => this.setState({isRecording: true});

  onPressRadioOut = () => this.setState({isRecording: false});

  handleCameraStream = (stream, updatePreview, gl) => {
    const loop = () => {

      if (this.state.isRecording) {
        const tensor = stream.next().value
        Promise.all([
          GLView.takeSnapshotAsync(gl),
          encodeJpeg(tensor),
        ])
          .then((images) => images.map((image) => image.uri))
          .then(this.props.handleSnapshot)
        tf.dispose([tensor]);
      }

      updatePreview()
      gl.endFrameEXP();
      this.rafID = requestAnimationFrame(loop);
    }

    loop();
  }

  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
  }

  renderBottomBar = () =>
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomBarIcon}
                        onPressIn={this.onPressRadioIn}
                        onPressOut={this.onPressRadioOut}>
        <Ionicons name="ios-radio-button-on" size={70} color="white"/>
      </TouchableOpacity>
    </View>;

  renderCamera = () =>
    (
      <View style={styles.cameraView}>
        <TensorCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          // Tensor related props
          cameraTextureHeight={height}
          cameraTextureWidth={width}
          resizeHeight={height}
          resizeWidth={width}
          resizeDepth={3}
          onReady={this.handleCameraStream}
          autorender={false}
        />
        {this.renderBottomBar()}
      </View>
    );

  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={styles.noPermissionsText}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
      <Button
        onPress={this.allowCameraPermission}
        title="Allow camera"
        color="white"
      />
    </View>;

  render() {
    return <View
      style={styles.container}>{this.state.cameraPermissionsGranted ? this.renderCamera() : this.renderNoPermissions()}</View>;
  }
}

export default CameraScreen
