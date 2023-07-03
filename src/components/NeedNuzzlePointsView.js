import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Text,
  Switch,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
//import all the components we are going to use.

import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../frequent/Constants';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp, Statusbar} from '../frequent/Utility/Utils';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
import commonUtility from '../frequent/Utility/CommonUtility';
import SCLAlertView from './SCLAlertView';

const NeedNuzzlePointsView = (props) => {
  const {willShow, onRequestClose} = props;
  return (
    <>
      <SCLAlertView
        // willHaveTwoControl={true}
        title={'Need More Points'}
        //yesButtonHeading={'Ok'}
        //noButtonHeading={'Cancel'}
        subtitle={"You don't have required nuZZle points!"}
        onRequestClose={() => this.onRequestClose()}
        //handleClose={() => this.handelPress()}
        willShow={willShow}></SCLAlertView>
    </>
  );
};

export default NeedNuzzlePointsView;
