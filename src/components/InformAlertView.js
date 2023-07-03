/* eslint-disable react-native/no-inline-styles */
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
} from 'react-native';
//import all the components we are going to use.

import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../frequent/Constants';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp, Statusbar, width, height} from '../frequent/Utility/Utils';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
import commonUtility from '../frequent/Utility/CommonUtility';
import Modal from 'react-native-modal';

const InformAlertView = (props) => {
  const {
    willShow,
    onRequestClose,
    willButtonVisible,
    isVisible,
    onBackdropPress,
    points,
    textHeadingOne,
    name,
    textHeadingTwo,
    earningPoints,
    textHeadingThirdVisible,
    nuzzlesText,
    onAccepted,
    backgroundColor,
    borderColor,
  } = props;
  return (
    <Modal
      onBackdropPress={() => onBackdropPress()}
      //coverScreen={false}
      animationType={'slide'}
      transparent={true}
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      visible={isVisible}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <View
        style={{
          // padding: 20,
          //height: 300,
          width: width / 1.1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
          backgroundColor: backgroundColor ? backgroundColor : 'white',
        }}>
        <View style={{padding: 10}}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 10,
              //backgroundColor: 'red',
            }}>
            <Image
              style={{height: 50, width: 45}}
              resizeMode="contain"
              source={ImageCostants.PROFILE.BOOST}></Image>
            <Text
              style={{
                marginLeft: -14,
                marginTop: 2,
                fontSize: 15,
                margin: 3,
                color: Constants.COLORS.buttonColor3,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {points}
            </Text>
          </View>
          {!willButtonVisible && !textHeadingThirdVisible && (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 5,
                fontSize: 37,
                margin: 10,
                letterSpacing: 1,
                lineHeight: 40,
                color: Constants.COLORS.buttonColor1,
                fontFamily: Constants.FONTFAMILY.BOLD,
              }}>
              {'Congratulations!'}
            </Text>
          )}

          <Text
            style={{
              //marginLeft: -12,
              color: Constants.COLORS.usernamecolr,
              textAlign: 'center',
              fontSize: 17,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              paddingHorizontal: 20,
              lineHeight: 25,
            }}>
            {textHeadingOne}
            <Text
              style={{
                marginLeft: -12,
                lineHeight: 25,
                color: Constants.COLORS.buttonColor1,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {name}
            </Text>
          </Text>
          <Text
            style={{
              marginBottom: 10,
              color: Constants.COLORS.usernamecolr,
              fontSize: 17,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              textAlign: 'center',
              paddingHorizontal: 20,
              lineHeight: 25,
              // padding: 20,
            }}>
            {textHeadingTwo}
            <Text
              style={{
                marginLeft: -12,
                lineHeight: 25,
                color: Constants.COLORS.buttonColor3,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {earningPoints}
            </Text>
            <Text
              style={{
                //marginLeft: -12,
                color: Constants.COLORS.usernamecolr,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
                textAlign: 'center',
                paddingHorizontal: 20,
                lineHeight: 25,
              }}>
              {nuzzlesText}
            </Text>
          </Text>
          {textHeadingThirdVisible && (
            <Text
              style={{
                color: Constants.COLORS.usernamecolr,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
                textAlign: 'center',
                paddingHorizontal: 20,
                lineHeight: 35,
              }}>
              Do you wish to continue?
            </Text>
          )}
        </View>
        {willButtonVisible && (
          <View
            style={{
              height: 55,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 1,
              borderTopColor: borderColor
                ? 'white'
                : Constants.COLORS.greyLight,
            }}>
            <TouchableOpacity
              onPress={() => onRequestClose()}
              style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  color: Constants.COLORS.usernamecolr,
                  fontSize: 17,
                }}>
                Decline
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: '100%',
                width: 1,
                backgroundColor: backgroundColor
                  ? 'white'
                  : Constants.COLORS.greyLight,
              }}></View>
            <TouchableOpacity
              onPress={() => onAccepted()}
              style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  color: Constants.COLORS.buttonColor1,
                  fontSize: 17,
                }}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default InformAlertView;
