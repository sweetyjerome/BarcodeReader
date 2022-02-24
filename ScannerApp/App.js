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
      console.log('scanned dataa',res.data)
      setScannedData(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [item]);

  const barcodeRecognized = ({ barcodes }) => {
    setBarcodes(barcodes)
    console.log('barcodes', barcodes);
  }

  const renderBarcodes = () => (
    <View>{barcodes.map(renderBarcode)}</View>
  )
  const renderBarcode = ({ data }) => {
    setItem(data)
    console.log('data',data);
    parsedResponse()
    
  }
  const parsedResponse = () => {
    let lines = scannedData.split(/\r\n|\r|\n/);
    let paramRegex = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        cnt = 0,            //index of the products in . (0 = first product being scanned)
        retVal = {          //object with 2 entries 
            error : false,  //error flag to set the value of error returned.
            data : []       //an array of objects which has the name and details of the product. 
        };

    lines.forEach(line => {         
        if(paramRegex.test(line)) {
            let match = line.match(paramRegex), //match array will have 3 entries, first the whole line, second the property name third, the value.
            currentProduct = retVal.data[cnt];
            switch(match[1]) {  
                case "error":
                    retVal.error = match[2]; //eg: match = ["error=3", "error", "3"]
                    break;
                case "name":
                    currentProduct['name'] = match[2];
                    break;
                default:
                    retVal.data[cnt][match[1]] = match[2]; //append all the other properties of the product as key value pairs.
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
    if(parseInt(retVal.error) > 0) {
      Alert.alert(
        errorMessages[parseInt(retVal.error,10)].code,
        errorMessages[parseInt(retVal.error,10)].msg,
        [
          {
            text: 'Okay',
            style: 'cancel'
          }
        ],
        { cancelable: false }
      )
    }
    else {
      displayName(retVal.data[1].name)
    }
    
    
    console.log('dataaaa',retVal) //prints an object with a data array which has the name and details of the product as an object 
    
} 
const displayName = (value) => {
  var pdtName;
  if(value)
     pdtName = value;
  else
      pdtName = 'Product name not known';

  Alert.alert(
    'Scanned Data',
      pdtName,
    [
      {
        text: 'Okay',
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
          {barcodes? renderBarcodes : Alert.alert('Error')}
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