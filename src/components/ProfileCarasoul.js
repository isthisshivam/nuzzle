import Carousel, {Pagination} from 'react-native-snap-carousel';
import React, {Component} from 'react';
//import PropTypes from 'prop-types'; // ES6
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
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp} from '../frequent/Utility/Utils';
import commonUtility from '../frequent/Utility/CommonUtility';
//import ProgressiveImage from 'react-native-progressive-image';
const ProfileCarasoulView = (props) => {
  const {item} = props;
  const {uploadImageClick} = props;

  return (
    <>
      <TouchableOpacity
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          marginTop:
            Constants.DIMESIONS.WIDOWHEIGHT > 800 && Platform.OS === 'ios'
              ? heightToDp(3)
              : heightToDp(8),
          elevation: 5,
        }}>
        <ImageBackground
          style={{
            borderRadius: 15,
            height: Constants.DIMESIONS.WIDOWHEIGHT / 2.8,
            padding: 0,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: Constants.COLORS.greyLight,
          }}
          imageStyle={{borderRadius: 15}}
          resizeMode={'cover'}
          source={{
            uri: typeof item == 'object' ? item[0] : item,
          }}>
          <TouchableOpacity onPress={() => props.uploadImageClick()}>
            <Image
              style={{
                height: 40,
                width: 40,
                alignSelf: 'flex-end',
                marginTop: Constants.DIMESIONS.WIDOWHEIGHT / 3.4,
                marginRight: 30,
              }}
              source={ImageCostants.PROFILE.ADD}></Image>
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>
    </>
  );
};
export default ProfileCarasoulView;
