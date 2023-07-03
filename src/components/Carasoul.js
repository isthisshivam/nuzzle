// import Carousel, {Pagination} from 'react-native-snap-carousel';
// import React, {Component} from 'react';
// //import PropTypes from 'prop-types'; // ES6
// import Constants from '../frequent/Constants';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   TextInput,
//   Text,
//   FlatList,
//   StatusBar,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import ImageCostants from '../frequent/ImageConstants';
// import {heightToDp} from '../frequent/Utility/Utils';
// import commonUtility from '../frequent/Utility/CommonUtility';
// //import ProgressiveImage from 'react-native-progressive-image';
// const CarasoulView = (props) => {
//   console.log('props are in carosul view=>', JSON.stringify(props.item.profile_pic));
//   const {profile_pic, name, age, id, like} = props.item;
//   return (
//     <>
//       <TouchableOpacity
//         onPress={() =>
//           props.willImageClick
//             ? props.isLoggedIn && !props.isProfileCompleted
//               ? props.navigation.navigate(Constants.ROUTENAME.PROFILE, {
//                   id: id,
//                   name: name,
//                   profile_pic: profile_pic,
//                   isLiked: like,
//                 })
//               : commonUtility.navigateToPleaseLogInfirst(
//                   props,
//                   Constants.ROUTENAME.SPLASH,
//                 )
//             : null
//         }
//         style={{
//           shadowColor: '#000',
//           shadowOffset: {
//             width: 0,
//             height: 2,
//           },
//           shadowOpacity: 0.25,
//           shadowRadius: 3.84,
//           marginTop:
//             Constants.DIMESIONS.WIDOWHEIGHT > 800 && Platform.OS === 'ios'
//               ? heightToDp(3)
//               : heightToDp(8),
//           elevation: 5,
//         }}>
//         <ImageBackground
//           style={{
//             borderRadius: 15,
//             height: !props.willShowProfile
//               ? Constants.DIMESIONS.WIDOWHEIGHT > 800
//                 ? props.isLoggedIn && !props.isProfileCompleted
//                   ? Constants.DIMESIONS.WIDOWHEIGHT / 2.3
//                   : Constants.DIMESIONS.WIDOWHEIGHT / 2
//                 : props.isLoggedIn && !props.isProfileCompleted
//                 ? Constants.DIMESIONS.WIDOWHEIGHT / 2.4
//                 : Constants.DIMESIONS.WIDOWHEIGHT / 2.2
//               : Constants.DIMESIONS.WIDOWHEIGHT / 2.9,
//             padding: 0,
//             marginLeft: 10,
//             marginRight: 10,
//             backgroundColor: Constants.COLORS.greyLight,
//           }}
//           imageStyle={{borderRadius: 15}}
//           resizeMode={'cover'}
//           source={{uri: profile_pic[0]}}>
//           {props.uploadImageControlWillVisible ? (
//             <TouchableOpacity onPress={props.uploadImageClick}>
//               <Image
//                 style={{
//                   height: 40,
//                   width: 40,
//                   alignSelf: 'flex-end',
//                   marginTop: Constants.DIMESIONS.WIDOWHEIGHT / 3.5,
//                   marginRight: 30,
//                 }}
//                 source={ImageCostants.PROFILE.ADD}></Image>
//             </TouchableOpacity>
//           ) : null}
//         </ImageBackground>

//         {props.isLoggedIn && !props.isProfileCompleted ? (
//           <>
//             <Text
//               style={{
//                 color: Constants.COLORS.whiteColor,
//                 fontSize: 38,
//                 fontFamily: Constants.FONTFAMILY.BOLD,
//                 marginTop: heightToDp(4),
//                 textAlign: 'center',
//               }}
//               numberOfLines={1}>
//               {name == 'null' ? 'No User Name' : name}
//             </Text>
//             <Text
//               style={{
//                 color: Constants.COLORS.whiteColor,
//                 fontSize: 17,
//                 fontFamily: Constants.FONTFAMILY.REGULAR,
//                 marginTop: 0,
//                 textAlign: 'center',
//               }}>
//               {age != ''
//                 ? age + ' years  old, New York City'
//                 : ' New York City'}
//             </Text>
//           </>
//         ) : null}
//       </TouchableOpacity>
//     </>
//   );
// };
// export default CarasoulView;

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
import {heightToDp, height} from '../frequent/Utility/Utils';
import commonUtility from '../frequent/Utility/CommonUtility';
//import ProgressiveImage from 'react-native-progressive-image';
const CarasoulView = (props) => {
  const {profile_pic, name, age, id, like, city, device_token} = props.item;
  //console.log('props.isLoggedIn', JSON.stringify(props.item));
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          props.willImageClick
            ? props.isLoggedIn && !props.isProfileCompleted
              ? props.navigation.navigate(Constants.ROUTENAME.PROFILE, {
                  id: id,
                  name: name,
                  profile_pic: profile_pic[0],
                  isLiked: like,
                  another_user_fcm_tkn: device_token,
                })
              : commonUtility.navigateToPleaseLogInfirst(
                  props,
                  Constants.ROUTENAME.SPLASH,
                )
            : null
        }
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          // marginTop:
          //   Constants.DIMESIONS.WIDOWHEIGHT > 800 && Platform.OS === 'ios'
          //     ? heightToDp(3)
          //     : heightToDp(8),
          marginTop: 0,
          elevation: 5,
        }}>
        <ImageBackground
          style={{
            // borderRadius: 15,
            // height: !props.willShowProfile
            //   ? Constants.DIMESIONS.WIDOWHEIGHT > 800
            //     ? props.isLoggedIn && !props.isProfileCompleted
            //       ? Constants.DIMESIONS.WIDOWHEIGHT / 2.3
            //       : Constants.DIMESIONS.WIDOWHEIGHT / 2
            //     : props.isLoggedIn && !props.isProfileCompleted
            //     ? Constants.DIMESIONS.WIDOWHEIGHT / 2.4
            //     : Constants.DIMESIONS.WIDOWHEIGHT / 2.2
            //   : Constants.DIMESIONS.WIDOWHEIGHT / 2.9,
            height: '100%',
            // width: '100%',
            padding: 0,
            marginLeft: 0,
            marginRight: 0,
            backgroundColor: Constants.COLORS.greyLight,
          }}
          //imageStyle={{borderRadius: 15}}
          resizeMode={'cover'}
          source={{uri: profile_pic[0]}}>
          {props.uploadImageControlWillVisible ? (
            <TouchableOpacity onPress={props.uploadImageClick}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                  alignSelf: 'flex-end',
                  marginTop: Constants.DIMESIONS.WIDOWHEIGHT / 3.5,
                  marginRight: 30,
                }}
                source={ImageCostants.PROFILE.ADD}></Image>
            </TouchableOpacity>
          ) : null}

          {props.isLoggedIn && !props.isProfileCompleted ? (
            <View
              style={{
                position: 'absolute',
                alignItem: 'center',
                justifyContent: 'center',
                width: '100%',
                marginTop: height / 2.2,
              }}>
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 38,
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  marginTop: 30,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                {name == 'null' ? 'No User Name' : name}
              </Text>
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 17,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                  marginTop: 0,
                  textAlign: 'center',
                }}>
                {age != '' && age + ' years  old'}
                {city != '' ? city : ', New York City'}
              </Text>
            </View>
          ) : null}
        </ImageBackground>

        {/* {props.isLoggedIn && !props.isProfileCompleted ? (
          <View >
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 38,
                fontFamily: Constants.FONTFAMILY.BOLD,
                marginTop: heightToDp(4),
                textAlign: 'center',
              }}
              numberOfLines={1}>
              {name == 'null' ? 'No User Name' : name}
            </Text>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
                marginTop: 0,
                textAlign: 'center',
              }}>
              {age != ''
                ? age + ' years  old, New York City'
                : ' New York City'}
            </Text>
          </View>
        ) : null} */}
      </TouchableOpacity>
    </>
  );
};
export default CarasoulView;
