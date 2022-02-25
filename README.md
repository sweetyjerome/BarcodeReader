# BarcodeReader

## Getting Started ScannerApp

A simple EAN Barcode reader based on React Native. The App shows product information about the scanned barcode from the Open EAN/GTIN Database.
uses the [react-native-camera library](https://github.com/react-native-camera/react-native-camera/) and uses the API of [opengtindb.org](https://opengtindb.org/api.php)
 to get product information.


## Setting up the code and available scripts

go inside the project directory ScannerApp:

#### `cd ScannerApp`

install the dependencies for Android:

#### `npm install`

install the dependencies for IOS:

#### `cd ios && pod install`

then run:

#### `npx react-native run-android` or `npx react-native run-ios`
