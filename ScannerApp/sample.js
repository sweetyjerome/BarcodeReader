import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from "react";
import Axios from 'axios';
import config from './errors.config';

const Sample = () =>{
    const [currentProduct, setCurrentProduct] = useState({});
    const [scannedData, setScannedData] = useState('');
    const userId= 400000000
    const item = 978020137962
    const errorMessages = config.errors;
  
    useEffect(() => {
      Axios.get(`http://opengtindb.org/?ean=${item}&cmd=query&queryid=${userId}`)
      .then(res => {
        console.log(res)
        setScannedData(res.data)
      }).catch(err => {
        console.log(err);
      })
    }, []);

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
        if(parseInt(retVal.error) > 0) {
            console.log(retVal.error);
            throw new Error(errorMessages[parseInt(retVal.error,10)].msg);
        }
        console.log('dataaaa',retVal) //prints an object with a data array which has the name and details of the product as an object 
        
    }   
    return (
        <View style={styles.container}>
            <Text>hii</Text>

            {parsedResponse()} 
        </View>
    )
}

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

  export default Sample;