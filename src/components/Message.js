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
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Constants from '../frequent/Constants';
import {
  heightToDp,
  StatusbarA,
  isSignedIn,
  widthToDp,
} from '../frequent/Utility/Utils';
import ImageCostants from '../frequent/ImageConstants';
import moment from 'moment';
const Message = (props) => {
  const {
    side,
    message,
    sender_image,
    textOrImage,
    sender_id,
    time,
    type,
    imageUrl,
    onClick,
    isPlaying,
    index,
    userId,
    receiver_image,
    isImageViewOpened,
    onRequestImageOpenOrClose,
    onAnotherUserImageClick,
    mode,
  } = props;
  console.log('sender_id.MESSAGE UI=>', sender_id);
  return (
    <View
      style={{
        backgroundColor: 'white',
        marginTop: 20,
        paddingHorizontal: 5,
      }}>
      {side == 'right' ? (
        <View>
          <View
            style={{
              backgroundColor:
                type == 'text'
                  ? Constants.COLORS.buttonColor1
                  : Constants.COLORS.whiteColor,
              marginLeft: 50,
              alignSelf: 'flex-end',
              paddingHorizontal: type == 'text' ? 20 : 0,
              paddingVertical: type == 'text' ? 15 : 0,
              borderRadius: 12,
            }}>
            {type == 'text' && (
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 14,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                  marginTop: 0,
                }}>
                {message}
              </Text>
            )}
            {type == 'image' && imageUrl != '' && mode && (
              <TouchableOpacity
                onPress={() => onRequestImageOpenOrClose(index)}>
                <ImageBackground
                  style={{height: 200, width: 200}}
                  imageStyle={{borderRadius: 10}}
                  resizeMode="cover"
                  source={{uri: imageUrl}}></ImageBackground>
              </TouchableOpacity>
            )}

            {type == 'image' && imageUrl != '' && !mode && (
              <TouchableOpacity>
                <ImageBackground
                  style={{
                    height: 200,
                    width: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  imageStyle={{borderRadius: 10}}
                  resizeMode="cover"
                  source={{uri: imageUrl}}>
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color="white"></ActivityIndicator>
                </ImageBackground>
              </TouchableOpacity>
            )}

            {/* {type == 'image' && isLoading && (
              <TouchableOpacity>
                <ImageBackground
                  style={{
                    height: 200,
                    width: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  imageStyle={{borderRadius: 10}}
                  resizeMode="cover"
                  source={{uri: loadingImageUrl}}>
                  <ActivityIndicator
                    size="large"
                    animating={isLoading}
                     color="white"></ActivityIndicator>
                </ImageBackground>
              </TouchableOpacity>
            )} */}

            {type == 'audio' && !isPlaying && (
              <TouchableOpacity onPress={() => onClick(imageUrl, index)}>
                <ImageBackground
                  style={{height: 50, width: 50}}
                  resizeMode="contain"
                  source={ImageCostants.NUZZLEUP.PLAY_RECORD}></ImageBackground>
              </TouchableOpacity>
            )}
            {type == 'audio' && isPlaying && (
              <TouchableOpacity onPress={() => onClick(imageUrl, index)}>
                <ImageBackground
                  style={{height: 50, width: 50}}
                  resizeMode="contain"
                  source={ImageCostants.NUZZLEUP.STOP_RECORD}></ImageBackground>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              color: Constants.COLORS.seeyouback,
              fontSize: 14,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              marginTop: 6,
              marginRight: 5,
              alignSelf: 'flex-end',
              //textAlign: 'justify',
              paddingHorizontal: 0,
            }}>
            {moment(time).calendar()}
            {/* {moment(time).format('dddd')} */}
            {/* {moment(time).format('h:mm: a')} */}
          </Text>
        </View>
      ) : (
        <View>
          <View style={{flexDirection: 'row'}}>
            {userId != sender_id ? (
              <TouchableOpacity
                onPress={() => onAnotherUserImageClick(sender_id)}>
                <ImageBackground
                  style={{
                    height: 30,
                    width: 30,
                  }}
                  imageStyle={{borderRadius: 30 / 2}}
                  resizeMode={'cover'}
                  source={{
                    uri: Array.isArray(sender_image)
                      ? sender_image[0]
                      : sender_image,
                  }}></ImageBackground>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onAnotherUserImageClick(sender_id)}>
                <ImageBackground
                  style={{
                    height: 30,
                    width: 30,
                  }}
                  imageStyle={{borderRadius: 30 / 2}}
                  resizeMode={'cover'}
                  source={{uri: receiver_image}}></ImageBackground>
              </TouchableOpacity>
            )}

            <View
              style={{
                // backgroundColor: 'yellow',
                marginRight: 100,
                marginLeft: 10,
                paddingHorizontal: type == 'text' ? 20 : 0,
                paddingVertical: type == 'text' ? 15 : 0,
                borderRadius: 12,
                backgroundColor:
                  type == 'text'
                    ? Constants.COLORS.buttonColor4
                    : Constants.COLORS.whiteColor,
              }}>
              {type == 'text' && (
                <Text
                  style={{
                    color: Constants.COLORS.whiteColor,
                    fontSize: 14,
                    fontFamily: Constants.FONTFAMILY.REGULAR,
                    marginTop: 0,
                    textAlign: 'justify',
                  }}>
                  {message}
                </Text>
              )}
              {type == 'image' && (
                <TouchableOpacity
                  onPress={() => onRequestImageOpenOrClose(index)}>
                  <ImageBackground
                    style={{height: 200, width: 200}}
                    imageStyle={{borderRadius: 10}}
                    resizeMode="cover"
                    source={{uri: imageUrl}}></ImageBackground>
                </TouchableOpacity>
              )}

              {type == 'audio' && !isPlaying && (
                <TouchableOpacity onPress={() => onClick(imageUrl, index)}>
                  <ImageBackground
                    style={{height: 50, width: 50}}
                    resizeMode="contain"
                    source={
                      ImageCostants.NUZZLEUP.PLAY_RECORD
                    }></ImageBackground>
                </TouchableOpacity>
              )}
              {type == 'audio' && isPlaying && (
                <TouchableOpacity onPress={() => onClick(imageUrl, index)}>
                  <ImageBackground
                    style={{height: 50, width: 50}}
                    resizeMode="contain"
                    source={
                      ImageCostants.NUZZLEUP.STOP_RECORD
                    }></ImageBackground>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text
            style={{
              color: Constants.COLORS.seeyouback,
              fontSize: 14,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              marginTop: 6,
              marginLeft: widthToDp(10),
              paddingHorizontal: 20,
              alignSelf: 'flex-start',
              paddingHorizontal: 0,
            }}>
            {moment(time).calendar()}
            {/* {moment(time).format('h:mm: a')} */}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Message;
