import React from 'react';
import {
  Dimensions,
  PixelRatio,
  AsyncStorage,
  Platform,
  StatusBar,
  View,
  Modal,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import Constants from '../frequent/Constants';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp, widthToDp} from '../frequent/Utility/Utils';
import {Loader} from '../frequent/Utility/Loader';
const LoaderComponent = (props) => {
  const {isLoading} = props;
  return (
    <Modal animated={true} transparent={true} visible={isLoading}>
      <Loader />
    </Modal>
  );
};

export default LoaderComponent;
