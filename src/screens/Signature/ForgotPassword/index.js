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
} from 'react-native';
import Constants from '../../../frequent/Constants';
import ImageCostants from '../../../frequent/ImageConstants';
import {heightToDp} from '../../../frequent/Utility/Utils';
import CustomizedButton from '../../../components/Button';
import HeaderWithImage from '../../../components/HeaderWithImage';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {bindActionCreators} from 'redux';
import * as ForgotPasswordAction from '../../../redux/actions/ForgotPasswordAction';
import {connect} from 'react-redux';
import * as ApiConstants from '../../../frequent/Utility/ApiConstants';
import commonUtility from '../../../frequent/Utility/CommonUtility';
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
    };
  }

  forgotPasswordRequest = async () => {
    if (this.state.userName) {
      let formData = new FormData();
      formData.append(ApiConstants.EMAIL, this.state.userName);
      this.props.actions.ForgotPasswordTo.forgotPasswordRequest(
        formData,
        this._onSuccessForgotPassword,
        this._onFailureForgotPassword,
      );
    } else {
      commonUtility.displayToast('Please fill email first.');
    }
  };

  _onSuccessForgotPassword = async (responseData) => {
    if (responseData.status == ApiConstants.SUCCESS) {
      commonUtility.displayToast('password send to the email address.');
      this.props.navigation.goBack();
    }
  };

  _onFailureForgotPassword = async (error) => {};

  render() {
    const {userName} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={"#8f0412"}
          translucent={false}
        /> */}
        {/* <HeaderWithImage title={''}></HeaderWithImage> */}
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
            {'Forgot'}
          </Text>
          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 35,
              textAlign: 'center',
              letterSpacing: 0.6,
              fontFamily: Constants.FONTFAMILY.BOLD,
              lineHeight: 40,
            }}>
            {'Password'}
          </Text>

          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 17,
              textAlign: 'center',
              fontFamily: Constants.FONTFAMILY.REGULAR,
              marginTop: 20,
              lineHeight: 20,
              paddingHorizontal: 20,
            }}>
            {
              'Enter you email address,  we will send you the  instructions on how  to change you password'
            }
          </Text>
          <View style={{paddingHorizontal:20, marginTop:20}}>
               <Text style={{
                fontFamily: Constants.FONTFAMILY.BOLD,
                paddingHorizontal: 5,
                paddingVertical: 15,
                color:Constants.COLORS.whiteColor
              }}>{'EMAIL ADDRESS'}</Text>
              <TextInput
              placeholder={'john@gmail.com'}
              keyboardType='email-address'
              value={userName}
              onChangeText={(userName) => this.setState({userName})}
              style={{
                height:40,
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
              fontSize: 19,
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

              <CustomizedButton
                handelPress={() =>
                this.props.navigation.navigate('Verification')
                }
                text={'SEND'}
                textColor={Constants.COLORS.whiteColor}
                backgroundColor={Constants.COLORS.buttonColor1}
                marginFromTop={0}
              />
            
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({});

//redux function for login
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      ForgotPasswordTo: bindActionCreators(ForgotPasswordAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
