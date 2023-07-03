import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  Modal,
  FlatList,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 94 : 55;
import commonUtility from '../../../src/frequent/Utility/CommonUtility';
//////////////////////////////
class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      isVisible: true,
      anotherUserId: this.props.route.params.id
        ? this.props.route.params.id
        : null,
      anotherUserName: this.props.route.params.name,
      anotherUserProfile: this.props.route.params.profile_pic,
    };
  }

  openAnotherUserProfile = () => {
    console.log('openAnotherUserProfile.props=', this.props.route.params);
    var userDetailsObject = {
      id: this?.props?.route?.params?.id,
      name: this.props.route.params.name,
      userMatchStatus: this.props.route.params.userMatchStatus,
      profile_pic: this.props.route.params.profile_pic,
      another_user_fcm_tkn: this.props.route.params.another_user_fcm_tkn,
      route: 'MATCH',
    };
    this.props.navigation.navigate(
      Constants.ROUTENAME.PROFILE,
      userDetailsObject,
    );
  };
  openCurrentUserProfile = () => {
    this.props.navigation.navigate(Constants.ROUTENAME.EDITPROFILE, {
      CAMERA_WILL_OPEN: false,
    });
  };
  renderHeader() {
    return (
      <View
        style={{
          height: APPBAR_HEIGHT,
          flexDirection: Constants.STRING.ROW,
          marginTop: heightToDp(8),
          backgroundColor: Constants.COLORS.buttonColor4,
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
        }}>
        {/* <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(Constants.ROUTENAME.FILTER)
          }
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            // borderRadius: 40 / 2,
            // borderColor: 'white',
            //borderWidth: 1,
          }}>
          <ImageBackground
            style={{height: 45, width: 45, justifyContent: 'center'}}
            resizeMode="contain"
            source={ImageCostants.NUZZLEUP.FILTER}></ImageBackground>
        </TouchableOpacity> */}

        <View style={{flex: 1, alignItems: 'center'}}>
          {/* <ImageBackground
            style={{height: 30, width: 100, alignSelf: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.NUZZELGRAYEXT}></ImageBackground> */}
          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 30,
              fontFamily: Constants.FONTFAMILY.BOLD,
              marginTop: 20,
              textAlign: 'center',
            }}>
            {'geoDate'}
          </Text>
        </View>

        {/* <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(Constants.ROUTENAME.SETTING)
          }
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            // borderRadius: 40 / 2,
            //borderColor: 'white',
            //borderWidth: 1,
          }}>
          <ImageBackground
            style={{height: 45, width: 45, justifyContent: 'center'}}
            resizeMode="contain"
            source={ImageCostants.NUZZLEUP.SETTING}></ImageBackground>
        </TouchableOpacity> */}
      </View>
    );
  }
  _renderItem = ({item, index}) => {
    //console.log('daaaaaata', item);
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(Constants.ROUTENAME.PROFILE)
        }
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          marginTop: heightToDp(10),
          elevation: 5,
        }}>
        <ImageBackground
          style={{
            borderRadius: 5,
            height: Constants.DIMESIONS.WIDOWHEIGHT / 2.2,
            padding: 0,
            marginLeft: 10,
            marginRight: 0,
            backgroundColor: 'transparent',
          }}
          imageStyle={{borderRadius: 15}}
          resizeMode={'cover'}
          source={ImageCostants.PROFILE.USERPROFILE}></ImageBackground>
      </TouchableOpacity>
    );
  };
  render() {
    const {profile_pic} =
      this.props.userLoginData == undefined
        ? this.props.userRegisterData || this.props.userVarifyData
        : this.props.userRegisterData || this.props.userLoginData;
    const {anotherUserId, anotherUserProfile, anotherUserName} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          // height: '100%',
        }}>
        <ImageBackground
          style={{
            flex: 1,
          }}
          source={ImageCostants.SPLASH.PATHBACKGROUND}>
          {this.renderHeader()}
          <ScrollView>
            <View
              style={{
                height: '80%',
                width: '80%',
                marginTop: heightToDp(3),
                //backgroundColor: 'red',
                alignSelf: 'center',
                //justifyContent: 'center',
              }}>
              {/* <View
              style={{
                height: 60,
                flexDirection: Constants.STRING.ROW,
                marginTop: heightToDp(0),
                //backgroundColor: Constants.COLORS.buttonColor2,
                paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
                justifyContent: Constants.STRING.CENTER,
              }}>
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 30,
                  marginTop: heightToDp(2),
                  textAlign: 'center',
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  lineHeight: 35,
                }}>
                {"It's a match!"}
              </Text>
            </View> */}
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 30,
                  marginTop: heightToDp(2),
                  textAlign: 'center',
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  lineHeight: 30,
                }}>
                {"It's a match!"}
              </Text>
              <View
                style={{
                  // backgroundColor: 'yellow',
                  height: 250,
                  alignSelf: 'center',
                  margin: heightToDp(5),
                  width: '90%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '55%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    // position: 'relative',
                    zIndex: 11,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.openCurrentUserProfile()}>
                    <ImageBackground
                      style={{
                        height: 70,
                        width: 70,
                      }}
                      imageStyle={{borderRadius: 70 / 2}}
                      resizeMode={'cover'}
                      source={{
                        uri: profile_pic[0],
                        // uri: 'https://picsum.photos/seed/picsum/200/300',
                      }}></ImageBackground>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.openAnotherUserProfile()}>
                    <ImageBackground
                      style={{
                        height: 70,
                        width: 70,
                      }}
                      imageStyle={{borderRadius: 70 / 2}}
                      resizeMode={'cover'}
                      source={{uri: anotherUserProfile}}></ImageBackground>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '90%',
                    height: '80%',
                    marginTop: -30,
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 10,
                  }}>
                  <ImageBackground
                    style={{
                      height: 55,
                      marginTop: 40,
                      width: 55,
                    }}
                    //imageStyle={{borderRadius: 90 / 2}}
                    resizeMode={'contain'}
                    source={ImageCostants.SPLASH.FLASH}></ImageBackground>

                  <Text
                    style={{
                      color: Constants.COLORS.buttonColor2,
                      fontSize: 18,
                      marginTop: 10,
                      textAlign: 'center',
                      paddingHorizontal: 20,
                      fontFamily: Constants.FONTFAMILY.BOLD,
                      lineHeight: 20,
                    }}>
                    You and {anotherUserName} like each other, you can now send
                    a message
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginTop:
                    Constants.DIMESIONS.WIDOWHEIGHT < 800
                      ? heightToDp(5)
                      : heightToDp(20),
                }}>
                <CustomizedButton
                  handelPress={() =>
                    this.props.navigation.navigate(
                      Constants.ROUTENAME.CHATTING,
                      {
                        id: anotherUserId,
                        name: anotherUserName,
                        profile_pic: anotherUserProfile,
                        another_user_fcm_tkn:
                          this.props.route.params.another_user_fcm_tkn,
                      },
                    )
                  }
                  text={'SEND A MESSAGE'}
                  textColor={Constants.COLORS.whiteColor}
                  backgroundColor={Constants.COLORS.buttonColor1}
                  marginFromTop={0}
                />
                <CustomizedButton
                  handelPress={() =>
                    this.props.navigation.navigate(Constants.ROUTENAME.HOME)
                  }
                  text={'KEEP BROWSING'}
                  textColor={Constants.COLORS.whiteColor}
                  backgroundColor={Constants.COLORS.buttonColor2}
                  marginFromTop={15}
                />
              </View>
            </View>
          </ScrollView>
          {/* </Modal> */}
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
});

//redux function to do chat
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Match);
