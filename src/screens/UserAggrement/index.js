import React, {Component} from 'react';
import {
  SafeAreaView,
  Modal,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {bindActionCreators} from 'redux';
import commonUtility from '../../frequent/Utility/CommonUtility';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import SCLAlertView from '../../components/SCLAlertView';
import {connect} from 'react-redux';
import {Loader} from '../../frequent/Utility/Loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
import {WebView} from 'react-native-webview';
import * as UpdateUserAction from '../../redux/actions/UpdateUserAction';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import ImagePicker from 'react-native-image-crop-picker';
var userId;
class UserAggrement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserAggrement: false,
      show: false,
      isPermissions: false,
      isProfile: false,
      userId: '',
      avatarSource: '',
      isProfileCompleted: true,
    };
  }
  componentDidMount() {
    if (this.props.userVarifyData != undefined) {
      userId = this.props.userVarifyData.id;
    }
    //alert(userId);
  }

  onUpdateProfileClick = async () => {
    const {avatarSource} = this.state;
    const formData = new FormData();
    formData.append(ApiConstants.UID, userId);
    formData.append(ApiConstants.PROFILE_PIC, avatarSource);
    console.log('formdata', JSON.stringify(formData));
    this.props.actions.UpdateUserActionTo.updateUserRequest(
      formData,
      this._onSuccess,
      this._onFailure,
    );
  };

  _onSuccess = async (responsedata) => {
    if (responsedata.status == ApiConstants.SUCCESS) {
      let message = responsedata.message;
      setTimeout(() => {
        commonUtility.displayToast(message);
        this.props.navigation.reset({
          index: 0,
          routes: [
            {
              name: Constants.ROUTENAME.HOME,
            },
          ],
        });
      }, 1000);
    } else alert(ApiConstants.failed);
  };

  _onFailure = async (error) => {
    commonUtility.displayToast(error);
  };

  imageClick = (TYPE) => {
    this.RBSheetProfile.open();
    //  return;
    if (TYPE == 'CAMERA') {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        mediaType: 'photo',
        useFrontCamera: true,
        //cropping: true,
        compressImageQuality: 0.8,
      }).then((image) => {
        this.makeImage(image);
      });
    } else if (TYPE == 'GALLERY') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        mediaType: 'photo',
        //cropping: true,
        compressImageQuality: 0.8,
      }).then((image) => {
        this.makeImage(image);
      });
    }
  };
  makeImage = async (data) => {
    this.RBSheetProfile.close();
    console.log('IMAGE Fisrt =>', data);
    const localUri = data.path;
    const filename = localUri.split('/').pop();
    let fileType = data.mime;
    const newData = {
      uri: localUri,
      name: filename,
      type: fileType,
      //type: "image/jpeg",
      //mime: "image/jpeg",
    };

    console.log('IMAGE second =>', newData);
    this.setState({avatarSource: newData});
    setTimeout(() => {
      this.onUpdateProfileClick();
    }, 500);
  };

  handleClose = () => {
    this.setState({show: false});
    setTimeout(() => {
      this.setState({isPermissions: true});
    }, 500);
  };

  handlePermissionClose = () => {
    this.setState({isPermissions: false});
    setTimeout(() => {
      this.setState({isProfile: true});
    }, 500);
  };

  handleProfileClose = () => {
    this.setState({isProfile: false});
    setTimeout(() => {
      this.RBSheetProfile.open();
    }, 500);
  };

  checkAge() {
    //commonUtility.displayToast('Thanks for accepting Agreement.');
    setTimeout(() => {
      this.setState({UserAggrement: true, show: true});
    }, 1000);
  }

  renderBottomSheet() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetProfile = ref;
        }}
        height={200}
        closeOnPressMask={true}
        closeOnDragDown={true}
        customStyles={{
          container: {
            //  justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 19,
          },
          // wrapper: {
          //   backgroundColor: 'transparent',
          // },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 30,
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#353a50',
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}
            onPress={() => this.imageClick('CAMERA')}>
            <Text
              style={{
                fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                fontWeight: 'bold',
                color: Constants.COLORS.whiteColor,
                fontFamily: Constants.FONTFAMILY.BOLD,
                marginLeft: 5,
              }}>
              Open Camera
            </Text>
          </TouchableOpacity>
          {/* <View
            style={{
              backgroundColor: 'gray',
              height: 0.6,
              width: '100%',
            }}></View> */}
          <TouchableOpacity
            onPress={() => this.imageClick('GALLERY')}
            style={{
              backgroundColor: '#353a50',
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                fontWeight: 'bold',
                color: Constants.COLORS.whiteColor,
                fontFamily: Constants.FONTFAMILY.BOLD,
                marginLeft: 5,
              }}>
              Choose From Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }

  renderHeader() {
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          marginTop: heightToDp(0),
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
        }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            //marginTop: heightToDp(10),
            borderRadius: 40 / 2,
            borderColor: Constants.COLORS.buttonColor2,
            borderWidth: 1,
          }}>
          <ImageBackground
            style={{height: 20, width: 35, justifyContent: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.BACKBLACK}></ImageBackground>
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

  render() {
    const {UserAggrement, show, isPermissions, isProfile} = this.state;
    return (
      <View style={{flex: 1}}>
        <Statusbar />
        {this.renderHeader()}

        <Modal
          animated={true}
          transparent={true}
          visible={this.props.showLoader}>
          <Loader />
        </Modal>
        <View
          style={{
            height: 60,
            flexDirection: Constants.STRING.ROW,
            marginTop: heightToDp(0),
            // backgroundColor: Constants.COLORS.buttonColor2,
            paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
            justifyContent: Constants.STRING.CENTER,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.buttonColor2,
              fontSize: 35,
              marginTop: heightToDp(2),
              textAlign: 'center',

              fontFamily: Constants.FONTFAMILY.BOLD,
              lineHeight: 35,
            }}>
            {'Agreement'}
          </Text>
        </View>
        <ScrollView>
          {/* {show ? this.renderVerifyAgeAlert() : null} */}

          <SCLAlertView
            willHaveTwoControl={true}
            yesButtonHeading={'YES'}
            noButtonHeading={'NO'}
            title={'Age Verification!'}
            subtitle={'Please verify your age. Are you over 18 ?'}
            onRequestClose={() => this.handleClose()}
            handleClose={() => this.handleClose()}
            willShow={show}
          />
          <SCLAlertView
            willHaveTwoControl={true}
            yesButtonHeading={'YES'}
            noButtonHeading={'NO'}
            title={'Permissions Required!'}
            subtitle={
              'Please allow location , camera and notification permissions to give you better Performance'
            }
            onRequestClose={() => this.handlePermissionClose()}
            handleClose={() => this.handlePermissionClose()}
            willShow={isPermissions}
          />
          <SCLAlertView
            willHaveTwoControl={false}
            yesButtonHeading={'YES'}
            noButtonHeading={'NO'}
            title={'Let’s get started!'}
            subtitle={
              'Before you can view your NuZZles, let’s add at least one profile picture.'
            }
            // handleClose={() => this.handleProfileClose()}
            //onRequestClose={() => this.handleProfileClose()}
            handleClose={() => this.imageClick('CAMERA')}
            onRequestClose={() => this.imageClick('CAMERA')}
            willShow={isProfile}
          />
          {this.renderBottomSheet()}

          <WebView
            style={{
              height: Constants.DIMESIONS.WIDOWHEIGHT,
              width: Constants.DIMESIONS.WINDOWWIDTH,
              flex: 1,
            }}
            source={{uri: Constants.BASE_URL.AGGREMENT}}
          />
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            height: Platform.OS === 'ios' ? 100 : 70,
            backgroundColor: Constants.COLORS.whiteColor,
            justifyContent: 'center',
          }}>
          <CustomizedButton
            handelPress={() => this.checkAge()}
            text={'AGREE & CONTINUE'}
            textColor={Constants.COLORS.whiteColor}
            backgroundColor={Constants.COLORS.buttonColor1}
            marginFromTop={0}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  showLoader: state.updateUserReducer.showLoader,
  ///userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
});

//redux function for user aggrement
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      UpdateUserActionTo: bindActionCreators(UpdateUserAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAggrement);
