import React from 'react';
import {
  Dimensions,
  PixelRatio,
  Platform,
  StatusBar,
  View,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import Constants from '../frequent/Constants';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp, widthToDp} from '../frequent/Utility/Utils';
const CustomizedButton = (props) => {
  // console.log(props)
  return (
    <TouchableOpacity
      onPress={() => props.handelPress()}
      style={{
        height: 50,
        width: widthToDp(70),
        backgroundColor: props.backgroundColor,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: props.marginFromTop,
      }}>
      <Text
        style={{
          color: props.textColor,
          fontSize: 17,
          letterSpacing: 0.6,
          fontFamily: Constants.FONTFAMILY.REGULAR,
        }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomizedButton;
