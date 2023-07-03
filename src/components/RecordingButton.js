import React from 'react';
import {
  Dimensions,
  PixelRatio,
  AsyncStorage,
  Platform,
  StatusBar,
  ImageBackground,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from '../frequent/Constants';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp, widthToDp} from '../frequent/Utility/Utils';
import moment from 'moment';
const RecordingButton = (props) => {
  const {onClick, isRecording} = props;
  return (
    <TouchableOpacity
      onPress={() => onClick()}
      style={{
        height: 60,
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftColor: 'gray',
      }}>
      <Image
        style={{height: 30, width: 30}}
        source={
          isRecording
            ? ImageCostants.NUZZLEUP.STOP_RECORD
            : ImageCostants.NUZZLEUP.RECORD
        }></Image>
    </TouchableOpacity>
  );
};

export default RecordingButton;
