import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { TesseractOcr, TesseractLang } from 'react-native-tesseract-ocr';

export default function App() {
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const handlePictureTaken = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const ocrResult = await TesseractOcr.recognize(
        photo.uri,
        TesseractLang.ENG,
        {},
      );
      console.log(ocrResult);
      // TODO: parse the OCR result to identify words
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={() => setCameraReady(true)}
        ref={cameraRef}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePictureTaken}
          style={[styles.button, !cameraReady && styles.disabledButton]}
          disabled={!cameraReady}
        >
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
