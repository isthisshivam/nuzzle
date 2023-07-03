import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import Constants from '../../../frequent/Constants';
import CustomizedButton from '../../../components/Button';
import ImageCostants from '../../../frequent/ImageConstants';
import {heightToDp} from '../../../frequent/Utility/Utils';
import HeaderWithImage from '../../../components/HeaderWithImage';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {Loader} from '../../../frequent/Utility/Loader';
import {bindActionCreators} from 'redux';
import * as userAction from '../../../redux/actions/LoginAction';
import * as registerAction from '../../../redux/actions/RegisterAction';
import {connect} from 'react-redux';
import Secrets from '../../../frequent/Secrets';
import commonUtility from '../../../frequent/Utility/CommonUtility';
import loginReducer from '../../../redux/reducers/LoginReducer';
import * as ApiConstants from '../../../frequent/Utility/ApiConstants';
import {
  AppleButton,
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {setupPushNotification} from '../../../components/PushNotification';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFirstName: '',
      password: '',
      userInfo: {},
      userProfile: null,
      age: '',
      userEmail: '',
      userName: '',
      fcmToken: null,
      currentCity: null,
      currentLatitude: null,
      currentLongitude: null,
    };
  }

  componentDidMount = async () => {
    GoogleSignin.configure({
      webClientId: Secrets.GOOGLE_LOGIN_API_KEY.APIKEY,
    });
    this.getFcmTokenFromLocalStorage();
  };
  getFcmTokenFromLocalStorage = async () => {
    let [fcmToken] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.FCM_TOKEN),
    ]);

    if (typeof fcmToken == 'undefined' || fcmToken == null) {
      setupPushNotification(this.tokenCallBack);
    } else {
      this.tokenCallBack(fcmToken);
    }

    this.getUserLocationInfo();
  };

  tokenCallBack = async (tokenn) => {
    console.log('Firebase_Track_token_recieved', tokenn);
    await commonUtility.setStoreData('FCM_TOKEN', tokenn);

    await this.setState({fcmToken: tokenn});
  };
  getUserLocationInfo = async () => {
    let [locationObject] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.LOCATION_DATA),
    ]);

    var latitude = locationObject.currentLatitude;
    var longitude = locationObject.currentLongitude;
    var locationName = locationObject.locationName;

    this.setState({
      currentLatitude: latitude,
      currentLongitude: longitude,
      currentCity: locationName,
    });
  };

  handleAppleLoginAndroid = async () => {
    appleAuthAndroid.configure({
      clientId: Secrets.APPLE_LOGIN_API_KEY.API_KEY,
      redirectUri: Secrets.APPLE_LOGIN_API_KEY.REDIRECT_URL,
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      nonce:
        'Random nonce value, will be SHA256 hashed before sending to Apple',
      state: 'State',
    });
    return await appleAuthAndroid.signIn(); // user, state, id_token, code
    // Can now send the authorization code to your backend for verification
  };
  async onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }
  onGooglePress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  };

  loginWithFacebook = async () => {
    // // Attempt a login using the Facebook login dialog asking for default permissions.
    // LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    //   (login) => {
    //     if (login.isCancelled) {
    //       console.log('Login cancelled');
    //     } else {
    //       AccessToken.getCurrentAccessToken().then((data) => {
    //         const accessToken = data.accessToken.toString();
    //         this.getInfoFromLoginToken(accessToken);
    //       });
    //     }
    //   },
    //   (error) => {
    //     console.log('Login fail with error: ', JSON.stringify(error));
    //   },
    // );

    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };

  validateLogin() {
    var errorMessage = '';
    if (this.state.userName == '') errorMessage = ApiConstants.enter_email;
    else if (!commonUtility.validateEmail(this.state.userName.trim()))
      errorMessage = ApiConstants.enter_valid_email;
    else if (this.state.password.trim() == '')
      errorMessage = ApiConstants.enter_password;
    else if (this.state.password.trim().length < 6)
      errorMessage = ApiConstants.valid_password;

    if (errorMessage == '') return true;
    else alert(errorMessage);
  }

  submitLogin = async () => {
    this.props.logout();

    if (this.validateLogin()) {
      Keyboard.dismiss();
      this.submitLoginReguest();
    }
  };

  submitLoginReguest = async () => {
    const {fcmToken} = this.state;
    let formData = new FormData();
    formData.append(ApiConstants.USERNAME, this.state.userName);
    formData.append(ApiConstants.PASSWORD, this.state.password);
    formData.append(ApiConstants.DEVICE_TYPE, Platform.OS);
    formData.append(ApiConstants.DEVICE_TOKEN, fcmToken);
    console.log('submitLoginReguest==', formData);
    // return;
    this.props.actions.loginTo.doLogin(
      formData,
      this._onSuccess,
      this._onFailure,
    );
  };

  _onSuccess = async (loginData) => {
    this.redirectToHome();
  };

  redirectToHome = () => {
    this.setState({userName: ''});
    this.setState({password: ''});

    this.props.navigation.reset({
      index: 0,
      routes: [{name: Constants.ROUTENAME.HOME}],
    });
  };

  _onFailure = async (error) => {
    var responseData = error;
    if (responseData.message == ApiConstants.verification_pending) {
      commonUtility.displayToast(responseData.message);
      this.props.navigation.navigate(Constants.ROUTENAME.VERIFICATION, {
        email: this.state.userName,
      });
    } else alert(responseData.message);
  };

  socialLogin = async () => {
    const {fcmToken} = this.state;
    let formData = new FormData();
    formData.append(ApiConstants.NAME, this.state.userFirstName);
    formData.append(ApiConstants.EMAIL, this.state.userEmail);
    //formData.append(ApiConstants.AGE, this.state.age);
    formData.append(ApiConstants.PASSWORD, Secrets.PASSWORD.DUMMY_PASSWORD);
    formData.append(ApiConstants.DEVICE_TYPE, Platform.OS);
    formData.append(ApiConstants.DEVICE_TOKEN, fcmToken);
    formData.append(ApiConstants.SOCIAL_LOGIN, 1);
    formData.append(ApiConstants.LATITUDE, this.state.currentLatitude);
    formData.append(ApiConstants.LONGTITUDE, this.state.currentLongitude);
    formData.append(ApiConstants.CITY, this.state.currentCity);
    this.props.actions.registerAccount.startRegister(
      formData,
      this._onSuccessSocialLogin,
      this._onFailureSociaLogin,
    );
  };

  _onSuccessSocialLogin = async (responseData) => {
    this.redirectToHome();
    console.log('_onSuccessSocialLogin', JSON.stringify(responseData));
  };

  _onFailureSociaLogin = async (error) => {
    console.log('_onFailureSociaLogin', JSON.stringify(error));
    commonUtility.displayToast(
      'Something going wrong , please try after some time.',
    );
  };

  setFacebookInfo = async (userInfo) => {
    console.log('setFacebookInfo', userInfo);
    this.setState({
      userInfo,
      userProfile: userInfo.additionalUserInfo.profile.picture.data.url,
      userEmail: userInfo.additionalUserInfo.profile.email,
      userFirstName: userInfo.additionalUserInfo.profile.name,
    });
    this.socialLogin();
  };

  setGmailInfo = async (userInfo) => {
    console.log('setGmailInfo', userInfo);
    this.setState({
      userInfo,
      userProfile: userInfo.additionalUserInfo.profile.picture,
      userEmail: userInfo.additionalUserInfo.profile.email,
      userFirstName: userInfo.additionalUserInfo.profile.name,
    });
    this.socialLogin();
  };

  setAppleInfo = async (userInfo) => {
    console.log('setAppleInfo', userInfo);
    this.setState({
      userInfo,
      userProfile: userInfo.user.photoURL,
      userEmail: userInfo.user.email,
      userFirstName: userInfo.user.displayName,
    });
    this.socialLogin();
  };

  render() {
    const {userName, password} = this.state;
    return (
      <View style={{flex: 1}}>
        <Modal
          animated={true}
          transparent={true}
          visible={this.props.showLoader || this.props.showLoaderRegister}>
          <Loader />
        </Modal>

        <ImageBackground
          style={{
            height: Constants.DIMESIONS.height,
            width: Constants.DIMESIONS.width,
            flex: 1,
          }}
          source={ImageCostants.SPLASH.SPLASHBACKGROUND}>
          <HeaderWithImage
            nav={this.props.navigation}
            title={''}></HeaderWithImage>

          <ScrollView
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 35,
                textAlign: 'center',
                letterSpacing: 0.6,
                fontFamily: Constants.FONTFAMILY.BOLD,
                lineHeight: 50,
              }}>
              {'Login'}
            </Text>
            <View style={{paddingHorizontal: 20, marginTop: 20}}>
              <Text
                style={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  color: Constants.COLORS.whiteColor,
                }}>
                {'EMAIL ADDRESS'}
              </Text>
              <TextInput
                placeholder={'john@gmail.com'}
                keyboardType="email-address"
                value={userName}
                onChangeText={(userName) => this.setState({userName})}
                style={{
                  height: 40,
                  borderBottomColor: 'white',
                  borderBottomWidth: 0.9,
                  color: Constants.COLORS.whiteColor,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                  fontSize: 17,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}></TextInput>
              <Text
                style={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  paddingHorizontal: 5,
                  marginTop: 20,
                  paddingVertical: 15,
                  color: Constants.COLORS.whiteColor,
                }}>
                {'PASSWORD'}
              </Text>
              <TextInput
                secureTextEntry={true}
                placeholder={'******'}
                value={password}
                onChangeText={(password) => this.setState({password})}
                style={{
                  height: 40,
                  borderBottomColor: 'white',
                  borderBottomWidth: 0.9,
                  color: Constants.COLORS.whiteColor,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                  fontSize: 17,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}></TextInput>
            </View>

            {/* <FloatingLabelInput
              label={'EMAIL ADDRESS'}
              value={userName}
              //isPassword
              onChangeText={(userName) => this.setState({userName})}
              //onFocus={focus}
              //onBlur={blur}
              //isFocused={focused}
              containerStyles={{
                margin: 20,
                backgroundColor: 'transparent',
                height: 80,
              }}
              customLabelStyles={{
                colorFocused: 'white',
                colorBlurred: 'white',
                fontSizeFocused: 15,
              }}
              labelStyles={{
                fontFamily: Constants.FONTFAMILY.BOLD,
                //backgroundColor: '#fff',
                paddingHorizontal: 5,
                paddingVertical: 10,
              }}
              inputStyles={{
                borderBottomColor: 'white',
                borderBottomWidth: 0.5,
                color: 'white',
                paddingVertical: 0,
                paddingHorizontal: 10,
                marginTop: 15,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}
              hintTextColor={'white'}
              customShowPasswordComponent={<Text>Show</Text>}
              customHidePasswordComponent={<Text>Hide</Text>}
            /> */}

            {/* <FloatingLabelInput
              label={'PASSWORD'}
              value={password}
              //isPassword
              onChangeText={(password) => this.setState({password})}
              //onFocus={focus}
              //onBlur={blur}
              //isFocused={focused}
              containerStyles={{
                margin: 0,
                padding: 0,
                margin: 20,
                backgroundColor: 'transparent',
                height: 80,
              }}
              customLabelStyles={{
                colorFocused: 'white',
                colorBlurred: 'white',
                fontSizeFocused: 15,
              }}
              labelStyles={{
                fontFamily: Constants.FONTFAMILY.BOLD,
                //backgroundColor: '#fff',
                paddingHorizontal: 5,
                paddingVertical: 10,
              }}
              inputStyles={{
                borderBottomColor: 'white',
                borderBottomWidth: 0.5,
                color: 'white',
                paddingVertical: 0,
                paddingHorizontal: 10,
                marginTop: 15,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}
              hintTextColor={'white'}
              customShowPasswordComponent={<Text>Show</Text>}
              customHidePasswordComponent={<Text>Hide</Text>}
            /> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20,
                marginTop: heightToDp(8),
              }}>
              {/* <Pressable
                onPress={() => this.submitLogin()}
                style={{
                  backgroundColor: Constants.COLORS.buttonColor1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  height: 50,
                  width: 150,
                }}>
                <Text
                  style={{
                    color: Constants.COLORS.whiteColor,
                    fontSize: 17,
                    fontFamily: Constants.FONTFAMILY.REGULAR,
                  }}>
                  {'LOG IN'}
                </Text>
              </Pressable> */}

              <CustomizedButton
                handelPress={() => this.submitLogin()}
                text={'LOG IN'}
                textColor={Constants.COLORS.whiteColor}
                backgroundColor={Constants.COLORS.buttonColor1}
                marginFromTop={0}
              />
            </View>
            <Text
              onPress={() =>
                this.props.navigation.navigate(
                  Constants.ROUTENAME.FORGOTPASSWORD,
                )
              }
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 17,
                alignSelf: 'center',
                marginTop: 40,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {'Forgot Password?'}
            </Text>
            <View
              style={{
                backgroundColor: Constants.COLORS.transparent,
                marginTop: heightToDp(20),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => {
                  this.props.navigation.navigate(Constants.ROUTENAME.REGISTER);
                }}
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 17,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {'Or continue with'}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                margin: 90,
                justifyContent: 'space-between',
                marginTop: 16,
              }}>
              <TouchableOpacity
                style={{
                  height: 60,
                  width: 60,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  backgroundColor: Constants.COLORS.whiteColor,
                  borderRadius: 30,
                }}
                onPress={() =>
                  this.loginWithFacebook().then((data) => {
                    this.setFacebookInfo(data);
                  })
                }>
                <ImageBackground
                  style={{
                    // height: 60,
                    // width: 60,
                    height: 25,
                    width: 25,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  resizeMode={'contain'}
                  source={ImageCostants.SPLASH.FB}></ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 60,
                  width: 60,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  backgroundColor: Constants.COLORS.whiteColor,
                  borderRadius: 30,
                }}
                onPress={() =>
                  this.onGooglePress().then((data) => {
                    console.log('login succcess=>', JSON.stringify(data));
                    this.setGmailInfo(data);
                  })
                }>
                <ImageBackground
                  style={{
                    height: 25,
                    width: 25,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  resizeMode={'contain'}
                  source={ImageCostants.SPLASH.GOOGLE}></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 60,
                  width: 60,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  backgroundColor: Constants.COLORS.whiteColor,
                  borderRadius: 30,
                }}
                onPress={() =>
                  Platform.OS === 'android'
                    ? alert('Not available on android!')
                    : this.onAppleButtonPress().then((data) => {
                        console.log(
                          ' Apple login succcess=>',
                          JSON.stringify(data),
                        );
                        this.setAppleInfo(data);
                      })
                }>
                <ImageBackground
                  style={{
                    height: 25,
                    width: 25,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  resizeMode={'contain'}
                  source={ImageCostants.SPLASH.APPLE}></ImageBackground>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  showLoader: state.loginReducer.showLoader,
  showLoaderRegister: state.registerReducer.showLoader,
});

//redux function for login
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      loginTo: bindActionCreators(userAction, dispatch),
      registerAccount: bindActionCreators(registerAction, dispatch),
    },
    logout: () => dispatch(userAction.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
