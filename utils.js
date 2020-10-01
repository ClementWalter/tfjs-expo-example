import * as tf from '@tensorflow/tfjs';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';

export const encoderJpeg = async (tensor) => {
  const shape = [...tensor.shape]
  shape.pop()
  shape.push(4)  // enforce alpha channel
  const tensorWithAlpha = tf.concat([tensor, tensor], [-1]).slice([0], shape)
  const array = new Uint8Array(tensorWithAlpha.dataSync())
  const rawImageData = {
    data: array.buffer,
    width: shape[1],
    height: shape[0],
  };
  const jpegImageData = jpeg.encode(rawImageData, 50);
  const imgBase64 = tf.util.decodeString(jpegImageData.data, "base64")
  const salt = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
  const uri = FileSystem.documentDirectory + `tensor-${salt}.jpg`;
  await FileSystem.writeAsStringAsync(uri, imgBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return {uri, width: shape[1], height: shape[0]}
}
