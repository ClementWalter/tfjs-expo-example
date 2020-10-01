This repo shows a simple Expo app that attends to real-time predict on tensors with `cameraWithTensor` and in the mean
time to save images as jpg for later visualization.

The current app has two screen:
 - CameraScreen that allows for "recording" tensor stream
 - a Gallery from `react-native-photo-browser` to display the saved images.
 
 Currently two options have been considered but no one gives the expected result:
 - using `GLView.takeSnapshotAsync(gl)` the stored image is a zoom of what it visible on screen
 - using a util `encoderJpeg` build from the `tfjs-react-native` `decoderJpeg` util: the stored image is plain green
