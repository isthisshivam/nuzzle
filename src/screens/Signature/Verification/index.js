import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from 'react-native';
import CustomizedButton from '../../../components/Button';
import Constants from '../../../frequent/Constants';
import ImageCostants from '../../../frequent/ImageConstants';
import {heightToDp} from '../../../frequent/Utility/Utils';
import HeaderWithImage from '../../../components/HeaderWithImage';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import * as verificationAction from '../../../redux/actions/VerificationAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Loader} from '../../../frequent/Utility/Loader';
import * as ApiCons from '../../../frequent/Utility/ApiConstants';
import commonUtility from '../../../frequent/Utility/CommonUtility';

class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      email: props.route.params.email,
    };
  }

  resendCode = async () => {
    if (this.state.email != '') {
      let formData = new FormData();
      formData.append(ApiCons.EMAIL, this.state.email);

      this.props.actions.verifyTo.resendCode(
        formData,
        this._onSuccess,
        this._onFailure,
      );
    }
  };

  verifyCode = async () => {
    if (this.state.code == '')
      commonUtility.displayToast(ApiCons.code_not_empty);
    else if (this.state.email != '') {
      let formData = new FormData();
      formData.append(ApiCons.CODE, this.state.code);
      formData.append(ApiCons.EMAIL, this.state.email);
      this.props.actions.verifyTo.startVerification(
        formData,
        this._onSuccess,
        this._onFailure,
      );
    }
  };

  _onSuccess = async (responseData) => {
    if (responseData.message == ApiCons.valid_code) {
      commonUtility.displayToast(ApiCons.email_verified);

      this.props.navigation.reset({
        index: 0,
        routes: [{name: Constants.ROUTENAME.USERAGREMENT}],
      });
    } else {
      this.setState({code: ''});

      commonUtility.displayToast(responseData.message);
    }
  };

  _onFailure = async (error) => {
    var responseData = error;
    this.setState({code: ''});
    if (responseData?.message) commonUtility.displayToast(responseData.message);
  };

  render() {
    const {code} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
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

          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 35,
              textAlign: 'center',
              letterSpacing: 0.6,
              fontFamily: Constants.FONTFAMILY.BOLD,
              lineHeight: 40,
            }}>
            {'Verification'}
          </Text>

          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 17,
              textAlign: 'center',
              letterSpacing: 0.6,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              marginTop: 20,
              lineHeight: 20,
              paddingHorizontal: 20,
            }}>
            {'Please enter the verification code we sent to your email address'}
          </Text>
          <View style={{paddingHorizontal: 20, marginTop: 20}}>
            <Text
              style={{
                fontFamily: Constants.FONTFAMILY.BOLD,
                paddingHorizontal: 5,
                paddingVertical: 15,
                color: Constants.COLORS.whiteColor,
              }}>
              {'VERIFICATION CODE'}
            </Text>
            <TextInput
              placeholder={'*****'}
              value={code}
              keyboardType="numeric"
              secureTextEntry={true}
              onChangeText={(code) => this.setState({code})}
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
            label={'VERIFICATION CODE'}
            value={code}
            isPassword
            onChangeText={(code) => this.setState({code})}
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
              fontSize: 14,
              fontFamily: Constants.FONTFAMILY.REGULAR,
            }}
            hintTextColor={'white'}
            customShowPasswordComponent={<Text></Text>}
            customHidePasswordComponent={<Text>Hide</Text>}
          /> */}

          <View
            style={{
              //flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 20,
              marginTop: heightToDp(8),
            }}>
            {/* <TouchableOpacity
              onPress={() => this.verifyCode()}
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
                  letterSpacing: 0.6,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {'CONFIRM'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.resendCode()}
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
                  letterSpacing: 0.6,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {'RESEND CODE'}
              </Text>
            </TouchableOpacity> */}
            <CustomizedButton
              handelPress={() => this.verifyCode()}
              text={'CONFIRM'}
              textColor={Constants.COLORS.whiteColor}
              backgroundColor={Constants.COLORS.buttonColor1}
              marginFromTop={0}
            />
            <View style={{marginTop: heightToDp(8)}}>
              <CustomizedButton
                handelPress={() => this.resendCode()}
                text={'RESEND CODE'}
                textColor={Constants.COLORS.whiteColor}
                backgroundColor={Constants.COLORS.buttonColor1}
                marginFromTop={0}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  registerReducer: state.registerReducer,
  loginReducer: state.loginReducer,
  showLoader: state.verificationReducer.showLoader,
});

//redux function for verification
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      verifyTo: bindActionCreators(verificationAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
