import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useState } from 'react';
import Axios from 'axios';

const App = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [scannedData, setScannedData] = useState('');
  const userId= 400000000
  const item = 978020137962

  useEffect(() => {
    Axios.get(`http://opengtindb.org/?ean=${item}&cmd=query&queryid=${userId}`)
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err);
    })
  }, []);

  const barcodeRecognized = ({ barcodes }) => {
    setBarcodes(barcodes)
    if(barcodes){
      barcodes.forEach(barcode => console.log(barcode.data));
    }
  }

  const renderBarcodes = () => (
    <View>{barcodes.map(renderBarcode)}</View>
  )

  const renderBarcode = ({ data }) => {
    Alert.alert(
      'Scanned Data',
      data,
      [
        {
          text: 'Okay',
          onPress: () => console.log('Okay Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    )
  }

  return(
    <View style={styles.container}>
        <RNCamera
          captureAudio = 'false'
          ref={ref => {
            camera = ref
          }}
          captureAudio={false}
          type = {RNCamera.Constants.Type.back}
          style={styles.scanner}
          onGoogleVisionBarcodesDetected={barcodeRecognized}>
          {barcodes? renderBarcodes : Alert.alert('error')}
        </RNCamera>
      </View>
  )
}


// class App extends Component {
//   state = {
//     barcodes: [],
//     scannedData: '',
//   }
  
//   barcodeRecognized = ({ barcodes }) => {
//     this.setState({ barcodes });
//     if(barcodes){
//       barcodes.forEach(barcode => console.log(barcode.data));
//     }
//   }
//   renderBarcodes = () => (
//     <View>{this.state.barcodes.map(this.renderBarcode)}</View>
//   )

//   renderBarcode = ({ data }) =>
//     Alert.alert(
//       'Scanned Data',
//       data,
//       [
//         {
//           text: 'Okay',
//           onPress: () => console.log('Okay Pressed'),
//           style: 'cancel'
//         }
//       ],
//       { cancelable: false }
//     )
//   render() {
//     return (
//       <View style={styles.container}>
//         <RNCamera
//           captureAudio = 'false'
//           ref={ref => {
//             this.camera = ref
//           }}
//           captureAudio={false}
//           type = {RNCamera.Constants.Type.back}
//           style={styles.scanner}
//           onGoogleVisionBarcodesDetected={this.barcodeRecognized}>
//           {this.state.barcodes? this.renderBarcodes : Alert.alert('error')}
//         </RNCamera>
//       </View>
//     )
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor: 'black'
  },
  scanner: {
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  }
})

export default App