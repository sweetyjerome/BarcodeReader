import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import config from './errors.config';

const App = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [scannedData, setScannedData] = useState('');
  const [item, setItem] = useState('');
  const errorMessages = config.errors;
   
  useEffect(() => {
    let userId = 400000000;
    Axios.get(`http://opengtindb.org/?ean=${item}&cmd=query&queryid=${userId}`)
    .then(res => {
      console.log(res)
      setScannedData(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [item]);

  const barcodeRecognized = ({ barcodes }) => {
    setBarcodes(barcodes)
  }

  const renderBarcodes = () => (
    <View>{barcodes.map(renderBarcode)}</View>
  )
  const renderBarcode = ({ data }) => {
    setItem(data)
    parsedResponse()
  }
  const parsedResponse = () => {
    let lines = scannedData.split(/\r\n|\r|\n/);
    let paramRegex = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        cnt = 0, //index of the product count. (0= first product being scanned)
        retVal = {
            error : false,
            data : []
        };

    lines.forEach(line => {
        console.log('line',line)
         
        if(paramRegex.test(line)) {
            let match = line.match(paramRegex),
            currentProduct = retVal.data[cnt];
            console.log('mmmm',match)
            console.log('nnnn',currentProduct)
            switch(match[1]) {
                case "error":
                    retVal.error = match[2];
                    break;
                case "name":
                    currentProduct['name'] = match[2];
                    break;
                default:
                    retVal.data[cnt][match[1]] = match[2];
                    break;
            }
        }
        else {
            // add a new product
            if(line.indexOf('---') === 0) {
                cnt++;
                retVal.data[cnt] = {};
            }
        }
    });
    if(parseInt(retVal.error) > 3) {
        console.log(retVal.error);
        throw new Error(errorMessages[parseInt(retVal.error,10)].msg);
    }
    Alert.alert(
      'Scanned Data',
      retVal.data[1].name,
      [
        {
          text: 'Okay',
          onPress: () => console.log('Okay Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    )
    console.log('dataaaa',retVal) //prints an object with a data array which has the name and details of the product as an object 
    
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scanner: {
    flex: 1,
  }
})

export default App