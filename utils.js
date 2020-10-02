import * as tf from '@tensorflow/tfjs';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';

export const encodeJpeg = async (tensor) => {

  const height = tensor.shape[0]
  const width = tensor.shape[1]
  const data = new Buffer(
    // concat with an extra alpha channel and slice up to 4 channels to handle 3 and 4 channels tensors
    tf.concat([tensor, tf.ones([height, width, 1]).mul(255)], [-1])
      .slice([0], [height, width, 4])
      .dataSync(),
  )

  const rawImageData = {data, width, height};
  const jpegImageData = jpeg.encode(rawImageData, 100);

  const imgBase64 = tf.util.decodeString(jpegImageData.data, "base64")
  const salt = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
  const uri = FileSystem.documentDirectory + `tensor-${salt}.jpg`;
  await FileSystem.writeAsStringAsync(uri, imgBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return {uri, width, height}
}
