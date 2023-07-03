import React from 'react';
import {
  Dimensions,
  PixelRatio,
  AsyncStorage,
  Platform,
  StatusBar,
  View,
  Text,
  ImageBackground,
  Button,
  TouchableOpacity,
} from 'react-native';
import Constants from '../frequent/Constants';
import ImageCostants from '../frequent/ImageConstants';
import {heightToDp, widthToDp} from '../frequent/Utility/Utils';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 94 : 55;
const HeaderWithImage = (props) => {
  // console.log(props)

  return (
    <View
      style={{
        height: APPBAR_HEIGHT,
        flexDirection: Constants.STRING.ROW,
        marginTop: heightToDp(8),
        backgroundColor: Constants.COLORS.transparent,
        paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
        alignItems: Constants.STRING.CENTER,
      }}>
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          justifyContent: 'center',
          borderRadius: 40 / 2,
          borderColor: 'white',
          borderWidth: 1,
        }}
        onPress={() => props.nav.goBack()}>
        <ImageBackground
          style={{height: 20, width: 35, justifyContent: 'center'}}
          resizeMode="contain"
          source={ImageCostants.SPLASH.BACKIMG}></ImageBackground>
      </TouchableOpacity>

      <View style={{flex: 1, alignItems: 'center'}}>
        <ImageBackground
          style={{height: 30, width: 100, alignSelf: 'center'}}
          resizeMode="contain"
          source={ImageCostants.SPLASH.NUZZELWHITETEXT}></ImageBackground>
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
        // onPress={()=>props.nav.openDrawer()}
      >
        {/* <Image style={{height:Constants.HEIGHTWIDTH.BASEHEIGHT,
                        width:Constants.HEIGHTWIDTH.BASEWIDTH ,resizeMode:'contain'}} source =
                         {ImageConstant.HEADER.MENUDOTS}></Image> */}
      </TouchableOpacity>
    </View>
  );
};

export default HeaderWithImage;
