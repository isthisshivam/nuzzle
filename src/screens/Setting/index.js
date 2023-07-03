import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  Modal,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import commonUtility from '../../frequent/Utility/CommonUtility';
import WebViewLoader from '../../components/WebViewLoadingIndicator';
import Constants from '../../frequent/Constants';
import {bindActionCreators} from 'redux';
import {WebView} from 'react-native-webview';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar, isSignedIn} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
import {Loader} from '../../frequent/Utility/Loader';
import * as userAction from '../../redux/actions/LoginAction';
import * as logoutAction from '../../redux/actions/LogoutAction';
import {connect} from 'react-redux';
import LoaderComponent from '../../components/LoaderComponent';
import * as SetGetUserSettingAction from '../../redux/actions/SetGetUserSettingAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 0;
var userId = null;
class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushNotification: false,
      isBrowsing: false,
      isLoggedIn: false,
      isControlling: false,
      isVisible: false,
      isTandC: false,
      isPrivacyPolicy: false,
    };
  }

  componentDidMount() {
    isSignedIn(
      this.props.userLoginData ||
        this.props.userVerifyData ||
        this.props.userRegisterData,
    ).then((res) => {
      if (res) this.setState({isLoggedIn: true});
      else this.setState({isLoggedIn: false});
    });
    this.getUserId();
  }

  getUserId = async () => {
    if (
      this.props.userLoginData ||
      this.props.userVerifyData ||
      this.props.userRegisterData
    ) {
      const {id} =
        this.props.userLoginData == undefined
          ? this.props.userRegisterData || this.props.userVerifyData
          : this.props.userRegisterData || this.props.userLoginData;
      userId = id;
    } else {
      userId = null;
    }

    this.setGetUserSetting();
  };

  setGetUserSetting = async () => {
    const {pushNotification, isControlling} = this.state;
    const formData = new FormData();
    if (isControlling) {
      formData.append(
        ApiConstants.PUSH_NOTIFICATION_SETTING,
        pushNotification ? 1 : 0,
      );
      formData.append(ApiConstants.UID, userId);
    } else {
      formData.append(ApiConstants.UID, userId);
    }
    this.props.actions.setGetUserSetting.setGetUserSettingRequest(
      formData,
      this.onSetGetUserSettingSuccess,
      this.onSetGetUserSettingFailure,
    );
  };

  onSetGetUserSettingSuccess = async (responseData) => {
    if (responseData.status == ApiConstants.SUCCESS) {
      console.log('onSetGetUserSettingSuccess', responseData);
      var userInformation = responseData.data;
      var pushNotification = userInformation.push_notification;
      ///////////////////////
      if (pushNotification == 0) await this.setState({pushNotification: false});
      else if (pushNotification == 1)
        await this.setState({pushNotification: true});
    } else {
      commonUtility.displayToast('Something going wrong.');
    }
  };
  onSetGetUserSettingFailure = async (error) => {
    const {message} = error;
    commonUtility.displayToast(
      Constants.STRING.OOPS_SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_SOMETIME,
    );
  };

  handlePushNotification(value) {
    this.setState({isControlling: true});
    this.setState(
      {
        pushNotification: value,
      },
      () => {
        this.setGetUserSetting();
      },
    );
  }

  clearAppData = async function () {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing app data.');
    }
  };
  ///logout request
  logout = async () => {
    const formData = new FormData();
    formData.append(ApiConstants.UID, userId);
    this.props.actions.logoutRequest.logoutRequest(
      formData,
      this.onLogoutSuccess,
      this.onFailureLogout,
    );
  };

  onLogoutSuccess = async (responseData) => {
    if (responseData.status == ApiConstants.SUCCESS) {
      this.props.navigation.reset({
        index: 0,
        routes: [{name: Constants.ROUTENAME.SPLASH}],
      });
      this.clearAppData();
      this.props.logout();
    } else {
      commonUtility.displayToast(
        Constants.STRING.OOPS_SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_SOMETIME,
      );
    }
  };
  onFailureLogout = async (error) => {
    commonUtility.displayToast(
      Constants.STRING.OOPS_SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_SOMETIME,
    );
  };

  renderHeader() {
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          marginTop: heightToDp(0),
          backgroundColor: Constants.COLORS.buttonColor2,
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
          //justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            //marginTop: heightToDp(10),
            borderRadius: 40 / 2,
            borderColor: 'white',
            borderWidth: 1,
          }}>
          <ImageBackground
            style={{height: 20, width: 35, justifyContent: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.BACKIMG}></ImageBackground>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            //marginTop: heightToDp(10)
          }}>
          <ImageBackground
            style={{height: 50, width: 120, alignSelf: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.NUZZELWHITETEXT}></ImageBackground>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{
            height: 40,
            width: 40,
          }}></TouchableOpacity>
      </View>
    );
  }
  renderHeaderModal() {
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          marginTop: heightToDp(0),
          backgroundColor: Constants.COLORS.buttonColor2,
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
          //justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => this.setState({isVisible: false})}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            borderRadius: 40 / 2,
            borderColor: 'white',
            borderWidth: 1,
          }}>
          <ImageBackground
            style={{height: 20, width: 35, justifyContent: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.BACKIMGCROSS}></ImageBackground>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <ImageBackground
            style={{height: 50, width: 120, alignSelf: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.NUZZELWHITETEXT}></ImageBackground>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{
            height: 40,
            width: 40,
          }}></TouchableOpacity>
      </View>
    );
  }
  IndicatorLoadingView() {
    return (
      <ActivityIndicator
        color="pink"
        size="small"
        style={styles.IndicatorStyle}
      />
    );
  }

  render() {
    const {isLoggedIn, isPrivacyPolicy, isTandC} = this.state;
    const {isLoading, showLoader} = this.props;
    return (
      <View style={{flex: 1}}>
        <Statusbar />
        {this.renderHeader()}
        <LoaderComponent isLoading={isLoading || showLoader} />
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View
            style={{
              backgroundColor: 'white',
              marginTop: APPBAR_HEIGHT,
              height: Constants.DIMESIONS.WIDOWHEIGHT,
              width: Constants.DIMESIONS.WINDOWWIDTH,
            }}>
            {this.renderHeaderModal()}
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}>
              <WebView
                startInLoadingState={true}
                renderLoading={() => <WebViewLoader />}
                style={{
                  height: Constants.DIMESIONS.WIDOWHEIGHT,
                  width: Constants.DIMESIONS.WINDOWWIDTH,
                  flex: 1,
                }}
                source={{
                  uri: isTandC
                    ? Constants.BASE_URL.TERMSANDCONDITION
                    : Constants.BASE_URL.PRIVACY_POLICY,
                }}
              />
            </ScrollView>
          </View>
        </Modal>
        <View
          style={{
            height: 40,
            flexDirection: Constants.STRING.ROW,
            marginTop: heightToDp(0),
            backgroundColor: Constants.COLORS.buttonColor2,
            paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
            justifyContent: Constants.STRING.CENTER,
          }}>
          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 35,
              marginTop: heightToDp(0),
              textAlign: 'center',

              fontFamily: Constants.FONTFAMILY.BOLD,
              lineHeight: 35,
            }}>
            {'Settings'}
          </Text>
        </View>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              paddingHorizontal: 20,
              height: 55,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.tinyGrey,
                fontFamily: Constants.FONTFAMILY.REGULAR,
                fontSize: 19,
                fontWeight: '200',
                lineHeight: 20,
              }}>
              {'GENERAL'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate(Constants.ROUTENAME.EDITPROFILE, {
                CAMERA_WILL_OPEN: false,
              })
            }
            style={{
              paddingHorizontal: 20,
              height: 55,
              flexDirection: 'row',
              backgroundColor: Constants.COLORS.whiteColor,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.blackColor,
                fontSize: 19,
                fontWeight: '200',
                lineHeight: 20,
              }}>
              {'Profile'}
            </Text>
            <Text
              style={{
                color: Constants.COLORS.buttonColor1,
                fontSize: 19,
                fontWeight: '300',
                lineHeight: 20,
              }}>
              {'Edit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                isPrivacyPolicy: false,
                isTandC: true,
                isVisible: true,
              })
            }
            style={{
              paddingHorizontal: 20,
              height: 55,
              flexDirection: 'row',
              backgroundColor: Constants.COLORS.whiteColor,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.blackColor,
                fontSize: 19,
                fontWeight: '200',
                lineHeight: 20,
              }}>
              {Constants.STRING.TERMSANDCONDITION}
            </Text>
            <Text
              style={{
                color: Constants.COLORS.buttonColor1,
                fontSize: 19,
                fontWeight: '300',
                lineHeight: 20,
              }}>
              {'View'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                isPrivacyPolicy: true,
                isTandC: false,
                isVisible: true,
              })
            }
            style={{
              paddingHorizontal: 20,
              height: 55,
              flexDirection: 'row',
              backgroundColor: Constants.COLORS.whiteColor,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.blackColor,
                fontSize: 19,
                fontWeight: '200',
                lineHeight: 20,
              }}>
              {'Privacy Policy'}
            </Text>
            <Text
              style={{
                color: Constants.COLORS.buttonColor1,
                fontSize: 19,
                fontWeight: '300',
                lineHeight: 20,
              }}>
              {'View'}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              paddingHorizontal: 20,
              height: 55,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.tinyGrey,
                fontFamily: Constants.FONTFAMILY.REGULAR,
                fontSize: 19,
                lineHeight: 20,
              }}>
              {'ADVANCED'}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              height: 55,
              flexDirection: 'row',
              backgroundColor: Constants.COLORS.whiteColor,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.blackColor,
                fontSize: 19,
                fontWeight: '200',
                lineHeight: 20,
              }}>
              {'Push Notifications'}
            </Text>
            <Switch
              trackColor={{false: 'gray', true: Constants.COLORS.buttonColor1}}
              value={this.state.pushNotification}
              onValueChange={(pushNotification) =>
                this.handlePushNotification(pushNotification)
              }
            />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              height: 55,
              flexDirection: 'row',
              backgroundColor: Constants.COLORS.whiteColor,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomColor: Constants.COLORS.seeyouback,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                color: Constants.COLORS.blackColor,
                fontSize: 19,
                fontWeight: '200',
                lineHeight: 20,
              }}>
              {'Incognito Browsing'}
            </Text>
            <Switch
              trackColor={{false: 'gray', true: Constants.COLORS.buttonColor1}}
              value={this.state.isBrowsing}
              onValueChange={(isBrowsing) => this.setState({isBrowsing})}
            />
          </View>
        </ScrollView>

        {isLoggedIn && (
          <>
            <TouchableOpacity
              onPress={() => this.logout()}
              style={{
                height: 50,
                marginBottom: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: Constants.COLORS.transparent,
              }}>
              <ImageBackground
                style={{height: 30, width: 30}}
                source={ImageCostants.NUZZLEUP.LOGOUT}></ImageBackground>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 13,
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userLoginData: state.loginReducer.userData,
  userVerifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
  /// setGetUserSetting reducer variable
  isLoading: state.setGetUserSettingReducer.isLoading,
  //// logout re variable
  showLoader: state.logoutReducer.showLoader,
});

//redux function for login
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userAction.logout()),
  actions: {
    setGetUserSetting: bindActionCreators(SetGetUserSettingAction, dispatch),
    logoutRequest: bindActionCreators(logoutAction, dispatch),
  },
});
const styles = StyleSheet.create({
  IndicatorStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: -150,
    bottom: 0,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
