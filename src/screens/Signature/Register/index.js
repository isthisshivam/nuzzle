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
  Modal,
  ImageBackground,
} from 'react-native';
import * as ApiConstants from '../../../frequent/Utility/ApiConstants';
import Constants from '../../../frequent/Constants';
import ImageCostants from '../../../frequent/ImageConstants';
import {heightToDp} from '../../../frequent/Utility/Utils';
import CustomizedButton from '../../../components/Button';
import HeaderWithImage from '../../../components/HeaderWithImage';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {bindActionCreators} from 'redux';
import * as registerAction from '../../../redux/actions/RegisterAction';
import * as userAction from '../../../redux/actions/LoginAction';
import {connect} from 'react-redux';
import Secrets from '../../../frequent/Secrets';
import {Loader} from '../../../frequent/Utility/Loader';
import commonUtility from '../../../frequent/Utility/CommonUtility';
import * as ApiConsttants from '../../../frequent/Utility/ApiConstants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
///////////
import {
  AppleButton,
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      age: '',
      password: '',
      email: '',
      fcmToken: null,
      currentCity: null,
      currentLatitude: null,
      currentLongitude: null,
      zipCodeFromLocalStorage: null,
    };
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: Secrets.GOOGLE_LOGIN_API_KEY.APIKEY,
    });
    this.getFcmTokenFromLocalStorage();
    this.getUserLocationInfo();
  }
  getFcmTokenFromLocalStorage = async () => {
    let [fcmToken] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.FCM_TOKEN),
    ]);
    await this.setState({fcmToken});
  };

  getUserLocationInfo = async () => {
    let [locationObject] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.LOCATION_DATA),
    ]);

    var latitude = locationObject.currentLatitude;
    var longitude = locationObject.currentLongitude;
    var locationName = locationObject.locationName;
    var postalCode = locationObjectpostalCode; //got the postalCode
    this.setState({
      currentLatitude: latitude,
      currentLongitude: longitude,
      currentCity: locationName,
      zipCodeFromLocalStorage: postalCode,
    });
  };

  validateRegister() {
    var errorMessgae = '';
    if (this.state.userName.trim() == '')
      errorMessgae = ApiConsttants.enter_name;
    // else if (this.state.age.trim() == '')
    // errorMessgae = ApiConsttants.enter_age;
    else if (this.state.email.trim() == '')
      errorMessgae = ApiConsttants.enter_email;
    else if (!commonUtility.validateEmail(this.state.email.trim()))
      errorMessgae = ApiConsttants.enter_valid_email;
    else if (this.state.password.trim() == '')
      errorMessgae = ApiConsttants.enter_password;
    else if (this.state.password.trim().length < 6)
      errorMessgae = ApiConsttants.valid_password;

    if (errorMessgae == '') return true;
    else commonUtility.displayToast(errorMessgae);
  }

  submitRegister = async () => {
    this.props.clear();
    if (this.validateRegister()) {
      this.submitRegisterRequest();
    }
  };

  submitRegisterRequest = async () => {
    let formData = new FormData();
    formData.append(ApiConsttants.NAME, this.state.userName);
    formData.append(ApiConsttants.EMAIL, this.state.email);
    //  formData.append(ApiConsttants.AGE, this.state.age);
    formData.append(ApiConsttants.PASSWORD, this.state.password);
    formData.append(ApiConsttants.DEVICE_TYPE, Platform.OS);
    formData.append(ApiConsttants.DEVICE_TOKEN, this.state.fcmToken);
    formData.append(ApiConsttants.SOCIAL_LOGIN, 0);
    formData.append(ApiConsttants.LATITUDE, this.state.currentLatitude);
    formData.append(ApiConsttants.LONGTITUDE, this.state.currentLongitude);
    formData.append(ApiConsttants.CITY, this.state.currentCity);
    formData.append(ApiConstants.ZIP_CODE, this.state.zipCodeFromLocalStorage);
    this.props.actions.registerAccount.startRegister(
      formData,
      this._onSuccess,
      this._onFailure,
    );
  };

  _onSuccess = async (userData) => {
    this.props.navigation.navigate(Constants.ROUTENAME.VERIFICATION, {
      email: this.state.email,
    });

    // this.setState({userName: ""})
    // this.setState({password: ""})
    // this.setState({email: ""})
    // this.setState({age: ""})
  };

  _onFailure = async (error) => {
    var responseData = error;
    setTimeout(() => {
      commonUtility.displayToast(responseData.message);
    }, 100);
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
  redirectToHome = () => {
    this.setState({userName: ''});
    this.setState({password: ''});

    this.props.navigation.reset({
      index: 0,
      routes: [{name: Constants.ROUTENAME.HOME}],
    });
  };
  _onSuccessSocialLogin = async (loginData) => {
    this.redirectToHome();
  };

  _onFailureSociaLogin = async (error) => {
    var responseData = error;
    if (responseData.message == ApiConstants.verification_pending) {
      commonUtility.displayToast(responseData.message);
      this.props.navigation.navigate(Constants.ROUTENAME.VERIFICATION, {
        email: this.state.userName,
      });
    } else alert(responseData.message);
  };

  onGooglePress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
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
    const {userName, age, password, email} = this.state;
    return (
      <View style={{flex: 1}}>
        <Modal
          animated={true}
          transparent={true}
          visible={this.props.showLoader}>
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
          <KeyboardAwareScrollView
            extraScrollHeight={200}
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 35,
                textAlign: 'center',
                letterSpacing: 0.6,
                fontFamily: Constants.FONTFAMILY.BOLD,
                lineHeight: 50,
              }}>
              {'Sign Up'}
            </Text>

            <View style={{paddingHorizontal: 20, marginTop: 20}}>
              <Text
                style={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  color: Constants.COLORS.whiteColor,
                }}>
                {'YOUR NAME'}
              </Text>
              <TextInput
                placeholder={'John'}
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
              {/* <Text
                style={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  color: Constants.COLORS.whiteColor,
                }}>
                {'YOUR AGE'}
              </Text>
              <TextInput
                placeholder={'age'}
                keyboardType="number-pad"
                value={age}
                onChangeText={(age) => this.setState({age})}
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
                }}></TextInput> */}
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
                value={email}
                onChangeText={(email) => this.setState({email})}
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
                keyboardType="email-address"
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
              label={'YOUR NAME'}
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
              label={'YOUR AGE'}
              keyboardType={'numeric'}
              value={age}
              //isPassword
              onChangeText={(age) => this.setState({age})}
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

            {/* <FloatingLabelInput
              label={'EMAIL ADDRESS'}
              value={email}
              //isPassword
              onChangeText={(email) => this.setState({email})}
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
            {/* <FloatingLabelInput
              label={'PASSWORD'}
              value={password}
              isPassword
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
              customShowPasswordComponent={<Text></Text>}
              customHidePasswordComponent={<Text></Text>}
            /> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20,
                marginTop: heightToDp(8),
              }}>
              {/* <TouchableOpacity
                style={{
                  backgroundColor: Constants.COLORS.buttonColor1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  height: 50,
                  width: 150,
                }}>
                <Text
                  onPress={() => this.submitRegister()}
                  style={{
                    color: Constants.COLORS.whiteColor,
                    fontSize: 17,
                    letterSpacing: 0.6,
                    fontFamily: Constants.FONTFAMILY.REGULAR,
                  }}>
                  {'SIGN UP'}
                </Text>
              </TouchableOpacity> */}
              <CustomizedButton
                handelPress={() => this.submitRegister()}
                text={'SIGN UP'}
                textColor={Constants.COLORS.whiteColor}
                backgroundColor={Constants.COLORS.buttonColor1}
                marginFromTop={0}
              />
            </View>
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
            <View
              style={{
                height: 100,
                backgroundColor: Constants.COLORS.transparent,
                marginTop: heightToDp(9),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                onPress={() =>
                  this.props.navigation.navigate(Constants.ROUTENAME.LOGIN)
                }
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 17,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {'Already have an account?  Login'}
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  showLoader: state.registerReducer.showLoader,
});

//redux function for login
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      registerAccount: bindActionCreators(registerAction, dispatch),
    },
    clear: () => dispatch(userAction.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
