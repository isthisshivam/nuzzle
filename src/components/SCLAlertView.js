import Carousel, {Pagination} from 'react-native-snap-carousel';
import React, {Component} from 'react';
import Constants from '../frequent/Constants';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  FlatList,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import {heightToDp, StatusbarA} from '../frequent/Utility/Utils';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
const SCLAlertView = (props) => {
  console.log('props', props);
  const {
    willShow,
    onRequestClose,
    willHaveTwoControl,
    title,
    subtitle,
    yesButtonHeading,
    noButtonHeading,
    onyesPress,
  } = props;
  return (
    <>
      <View
        style={{
          flex: 1,
          //backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SCLAlert
          theme="inverse"
          show={willShow}
          slideAnimationDuration={0}
          title={title}
          titleStyle={{
            fontSize: 19,
            color: Constants.COLORS.buttonColor1,
            fontFamily: Constants.FONTFAMILY.BOLD,
          }}
          titleContainerStyle={{height: 23}}
          cancellable={false}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.8)'}}
          subtitleStyle={{
            fontSize: 15,
            color: Constants.COLORS.buttonColor2,
            textAlign: 'center',
            fontFamily: Constants.FONTFAMILY.REGULAR,
          }}
          subtitleContainerStyle={{
            height: 70,
          }}
          subtitle={subtitle}>
          {willHaveTwoControl ? (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => (onyesPress ? onyesPress() : onRequestClose())}
                style={{
                  height: 40,
                  backgroundColor: Constants.COLORS.buttonColor1,
                  alignItems: 'center',
                  borderRadius: 10,
                  marginRight: 10,
                  flex: 1,
                  // padding: -20,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: Constants.COLORS.whiteColor,
                    fontFamily: Constants.FONTFAMILY.BOLD,
                  }}>
                  {yesButtonHeading}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => props.onRequestClose()}
                style={{
                  height: 40,
                  backgroundColor: Constants.COLORS.buttonColor1,
                  alignItems: 'center',
                  borderRadius: 10,
                  flex: 1,
                  marginLeft: 10,
                  // padding: -20,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: Constants.COLORS.whiteColor,
                    fontFamily: Constants.FONTFAMILY.BOLD,
                  }}>
                  {noButtonHeading}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => props.onRequestClose()}
              style={{
                height: 40,
                backgroundColor: Constants.COLORS.buttonColor1,
                alignItems: 'center',
                borderRadius: 10,
                // padding: -20,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: Constants.COLORS.whiteColor,
                  fontFamily: Constants.FONTFAMILY.BOLD,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          )}
        </SCLAlert>
      </View>
    </>
  );
};
export default SCLAlertView;
