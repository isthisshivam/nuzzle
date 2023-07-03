import React from 'react';
import {
  Dimensions,
  PixelRatio,
  AsyncStorage,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import Constants from '../Constants';
const {width, height} = Dimensions.get('window');
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 0;

const Statusbar = () => {
  return (
    <View>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={'#2a2e42'}
        translucent={false}
      />
      <View style={{height: APPBAR_HEIGHT, backgroundColor: '#2a2e42'}} />
    </View>
  );
};
const StatusbarA = () => {
  return (
    <View>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={Constants.COLORS.buttonColor4}
        //backgroundColor={'#3598b0'}
        translucent={false}
      />
      <View
        style={{
          height: APPBAR_HEIGHT,
          backgroundColor: Constants.COLORS.buttonColor4,
        }}
      />
    </View>
  );
};
const widthToDp = (number) => {
  let givenWidth = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
  //will return a DPI(Density pixel ratio);
};

const heightToDp = (number) => {
  let givenHeight = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenHeight) / 100);
  //will return a DPI(Density pixel ratio);
};
const isSignedIn = (props) => {
  return new Promise((resolve, reject) => {
    if (props) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export {
  widthToDp,
  heightToDp,
  Statusbar,
  StatusbarA,
  isSignedIn,
  width,
  height,
};
