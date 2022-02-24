import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import config from './errors.config';

const App = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [item, setItem] = useState('');
  const errorMessages = config.errors;


  const barcodeRecognized = ({ barcodes }) => {
    //api call and parse inside api call. set parseddata in state var.
    setBarcodes(barcodes)
    console.log('bacodes set ',barcodes);
  }

  const renderBarcodes = () => {   //copy the return from line 37 here
    let userId = 400000000;
    console.log('api data', barcodes.data);
    Axios.get(`http://opengtindb.org/?ean=${barcodes.data}&cmd=query&queryid=${userId}`)
    .then(res => {
        console.log('res', res);
      var pdtName = parsedResponse(res.data)
      console.log('pdt name', pdtName);
      setItem(pdtName)
    }).catch(err => {
      console.log(err);
    })
    renderBarcode()
console.log('finished');
}
  const renderBarcode = () => {
    //print the description as ovrerlay on the camera.
    let bounds = barcodes.bounds;
    return(
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        {item ? <Text style={[styles.textBlock]}>{`${item}`}</Text> : null}
        
      </View>
    )
  
    
  }
  //to parse the plain text to json object format and returns the name of the product
  const parsedResponse = (resData) => {  
    let lines = resData.split(/\r\n|\r|\n/);
    console.log('liness',lines);
    let paramRegex = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        cnt = -1,            //index of the products in . (0 = first product being scanned)
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
    //handle errors
    if(parseInt(retVal.error) > 0) {
      Alert.alert(
        errorMessages[parseInt(retVal.error,10)].code,
        errorMessages[parseInt(retVal.error,10)].msg,
      )
    }
    //there might be cases where the eroor is returned as 0 but there isnt a name for the product
    else {
      if(!retVal.data[0].name){
        Alert.alert(
            'Name not found',
            'The product name was not found'
        )
      }
      console.log('ret val',retVal.data[0].name );
      return retVal.data[0].name 
    }
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
          {barcodes? renderBarcodes(barcodes[0]) : Alert.alert('Error')}
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
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})

export default App