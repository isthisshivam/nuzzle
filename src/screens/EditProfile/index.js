import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Text,
  Switch,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
//import all the components we are going to use.
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ProfileCarasoulView from '../../components/ProfileCarasoul';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as UpdateUserAction from '../../redux/actions/UpdateUserAction';
import * as GetUserProfileAction from '../../redux/actions/GetUserProfileAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
import {Loader} from '../../frequent/Utility/Loader';
import commonUtility from '../../frequent/Utility/CommonUtility';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import RangeSlider from 'rn-range-slider';
///import {Dropdown} from 'react-native-material-dropdown';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SCLAlertView from '../../components/SCLAlertView';
import InformAlertView from '../../components/InformAlertView';
import NeedNuzzlePointsView from '../../components/NeedNuzzlePointsView';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
global.funCalled = 0;
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      age: '',
      category: '',
      categoryId: null,
      gender: 'Select',
      about: '',
      profile: [],
      avatarSource: [],
      email: '',
      genderId: 1,
      counter: 0,
      currentLocation: '',
      currentLatitude: '',
      currentLongitude: '',
      nuzzlePoints: 0,
      cameraWillOpenForCompleteProfile:
        this.props.route.params.CAMERA_WILL_OPEN,
      fcmToken: null,
      customFilterArray: [
        {value: 'Asian', id: 1, isSelected: false},
        {value: 'Black/African', id: 2, isSelected: false},
        {value: 'Caucasian', id: 3, isSelected: false},
        {value: 'Hispanic/Latinx', id: 4, isSelected: false},
        {value: 'Black/African', id: 5, isSelected: false},
        {value: 'Native American', id: 6, isSelected: false},
        {value: 'Pacific Islander', id: 7, isSelected: false},
        {value: 'Other', id: 8, isSelected: false},
      ],
      openCameraForCompletingProfile: false,
      willShowUpgradeAlert: false,
      isVisible: false,
      zipCode: null,
      zipCodeFromLocalStorage: null,
    };
  }

  async componentDidMount() {
    this.getUserInfo();
    this.getFcmTokenFromLocalStorage();
    this.openCameraForCompletingProfile();
    global.funCalled++; //will increase everyTime
    console.log('global.funCalled value is=>', global.funCalled);
  }

  openCameraForCompletingProfile = async () => {
    //when loading completed then request for open camera
    if (!this.props.isLoading) {
      if (this.state.cameraWillOpenForCompleteProfile)
        this.imageClick('CAMERA');
      else return;
    }
  };

  getFcmTokenFromLocalStorage = async () => {
    let [fcmToken, location] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.FCM_TOKEN),
      await commonUtility.getStoreData(Constants.STRING.LOCATION_DATA),
    ]);
    await this.setState({
      fcmToken,
      currentLocation: location.locationName,
      currentLatitude: parseFloat(location.currentLatitude),
      currentLongitude: parseFloat(location.currentLongitude),
      zipCodeFromLocalStorage: location.postalCode,
    });
  };

  getUserInfo = async () => {
    const {id} =
      this.props.userLoginData == undefined
        ? this.props.userRegisterData || this.props.userVarifyData
        : this.props.userRegisterData || this.props.userLoginData;
    const formData = new FormData();
    formData.append(ApiConstants.USER_PROFILE_INFO, id);
    this.props.actions.GetUserProfileActionTo.getProfileRequest(
      formData,
      this._onSuccessInfo,
      this._onFailureInfo,
    );
  };

  _onSuccessInfo = async (responsedata) => {
    var response = responsedata.data;
    console.log('_ONSUCCESS Edit profile', JSON.stringify(response));
    //userInformation variables

    var userName = response.name;
    var age = response.age;
    var profile = response.profile_pic;
    var about = response.bio;
    var email = response.email;
    var genderId = response.gender;
    var userCategory = response.user_category;
    var nuzzle_points = response.nuzzle_points;
    var zipCode = response.zipcode;
    this.setState({
      userName,
      age,
      about,
      profile,
      email,
      gender: this.setGenderId(genderId),
      genderId: genderId,
      avatarSource: profile,
      category: userCategory,
      nuzzlePoints: nuzzle_points,
      userGotPointsAfterFilledOutNeededInfo: false,
      zipCode,
    });
    this.checkLengthAndForceToUploadProfilePic(profile);
  };

  setGenderId = (gender_id_id) => {
    var id = gender_id_id;
    if (id == '') {
      return 'Select';
    } else if (id == '1') {
      return 'Male';
    } else if (id == '0') {
      return 'Female';
    }
    //  genderId == 1 ? 'Male' : 'Female',
  };

  checkLengthAndForceToUploadProfilePic = async (profile) => {
    //check profile pic is less than 6
    if (profile.length < 6) {
      if (global.funCalled % 5 === 0) {
        // Will evaluate to true if the variable is divisible by 3 and will say to upload more profile pic
        this.setState({openCameraForCompletingProfile: true});
      }
    } else {
      ////add point to user one time not again and again.
      let [value] = await Promise.all([
        commonUtility.getStoreData(
          Constants.STRING.ADD_POINTS_IF_USER_COMPLETED_HIS_PROFILE_PICS,
        ),
      ]);
      // alert(value);
      if (value == null || !value)
        this.giveUserPointsIfUserHaveMoreThen6Photos();
    }
    //this.setState({isVisible: true});
  };

  giveUserPointsIfUserHaveMoreThen6Photos = async () => {
    this.setState({isVisible: true});
    await commonUtility.setStoreData(
      Constants.STRING.ADD_POINTS_IF_USER_COMPLETED_HIS_PROFILE_PICS,
      JSON.stringify(true),
    );
  };

  returnUserCategory(name) {
    var value = null;
    if (name == 1) {
      value = 'Asian';
    } else if (name == 2) {
      value = 'Black/African';
    } else if (name == 3) {
      value = 'Caucasian';
    } else if (name == 4) {
      value = 'Hispanic/Latinx';
    } else if (name == 5) {
      value = 'Black/African';
    } else if (name == 6) {
      value = 'Native American';
    } else if (name == 7) {
      value = 'Pacific Islander';
    } else if (name == 8) {
      value = 'Other';
    }

    return value;
  }

  _onFailureInfo = async (error) => {
    console.log('_ONFAILURE', JSON.stringify(error));
  };

  onUpdateProfileClick = async () => {
    if (this.state.gender == 'Select') {
      commonUtility.displayToast('Please choose Gender!');
      return;
    }
    const {
      userName,
      age,
      gender,
      about,
      genderId,
      profile,
      avatarSource,
      counter,
      fcmToken,
      category,
      categoryId,
      currentLocation,
      currentLatitude,
      currentLongitude,
      zipCode,
      zipCodeFromLocalStorage,
    } = this.state;
    const {id} =
      this.props.userLoginData == undefined
        ? this.props.userRegisterData || this.props.userVarifyData
        : this.props.userRegisterData || this.props.userLoginData;
    const formData = new FormData();
    formData.append(ApiConstants.UID, id);
    formData.append(ApiConstants.NAME, userName);
    formData.append(ApiConstants.BIO, about);
    formData.append(ApiConstants.AGE, age);
    formData.append(ApiConstants.GENDER, genderId + '');
    formData.append(ApiConstants.DEVICE_TYPE, Platform.OS);
    formData.append(ApiConstants.DEVICE_TOKEN, fcmToken);
    formData.append('city', currentLocation);
    formData.append(ApiConstants.LATITUDE, Number(currentLatitude));
    formData.append(ApiConstants.LONGTITUDE, Number(currentLongitude));
    formData.append(ApiConstants.USER_CATEGORY, category);
    formData.append(ApiConstants.ZIP_CODE, zipCodeFromLocalStorage);
    //formData.append(ApiConstants.EMAIL, 'rmoudgil333@gmail.com');
    //formData.append(ApiConstants.PASSWORD, 3);
    formData.append(ApiConstants.PROFILE_PIC, avatarSource[counter]);
    console.log('formData Edit profile', JSON.stringify(formData));
    // return;
    this.props.actions.UpdateUserActionTo.updateUserRequest(
      formData,
      this._onSuccess,
      this._onFailure,
    );
  };

  _onSuccess = async (responsedata) => {
    console.log('responsedata', responsedata);
    if (responsedata.status == ApiConstants.SUCCESS) {
      let message = responsedata.message;
      await this.setState({counter: this.state.counter + 1});
      console.log('counter is=>', this.state.counter);
      if (this.state.avatarSource.length != this.state.counter) {
        this.onUpdateProfileClick();
      } else if (this.state.avatarSource.length == this.state.counter) {
        this.setState({counter: 0});
        //await commonUtility.delay(300);
        setTimeout(() => {
          this.props.navigation.navigate(Constants.ROUTENAME.HOME);
          commonUtility.displayToast(message);
        }, 100);
      }
    } else alert(ApiConstants.failed);
  };

  _onFailure = async (error) => {
    const {message} = error;
    commonUtility.displayToast(message);
  };

  imageClick = (TYPE) => {
    this.RBSheet.open();
    if (TYPE == 'CAMERA') {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        mediaType: 'photo',
        //cropping: true,
        useFrontCamera: true,
        compressImageQuality: 0.8,
      })
        .then((image) => {
          var refArray = [];
          this.RBSheet.close();
          console.log('selected image.openCamera  data is =>', image);
          refArray.push(image);
          this.makeImage(refArray);
        })
        .catch((e) => {
          setTimeout(() => {
            commonUtility.displayToast(JSON.stringify(e.code));
          }, 1000);
        });
    } else if (TYPE == 'GALLERY') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        multiple: true,
        compressImageQuality: 0.5,
      }).then((image) => {
        this.makeImage(image);
        this.RBSheet.close();
        console.log('selected image.openPicker  data is =>', image);
      });
    }
  };
  makeImage(imagesArray) {
    this.RBSheet1.close();
    var refArray = [];
    imagesArray.map((data, index) => {
      //console.log('item is.makeImage =>', data.path);
      const localUri = data.path;
      let fileType = data.mime;
      const filename = localUri.split('/').pop();
      const newData = {
        uri: localUri,
        name: filename,
        type: fileType,
      };
      refArray.push(newData);
    });
    // const localUri = data.path;
    // const filename = localUri.split('/').pop();
    // let fileType = data.mime;
    // const newData = {
    //   uri: localUri,
    //   name: filename,
    //   type: fileType,
    //   //type: "image/jpeg",
    //   //mime: "image/jpeg",
    // };

    //console.log('IMAGE second =>', newData);
    this.setState({avatarSource: refArray});
    console.log('refArray=>', this.state.avatarSource.length);
  }

  setGender(gender) {
    if (gender == 'Male') this.setState({genderId: 1});
    else if (gender == 'Female') this.setState({genderId: 0});
    this.setState({gender}, () => {
      this.RBSheet1.close();
    });
  }
  renderBottomSheet() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
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
  renderGenderBottomSheet() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet1 = ref;
        }}
        //  closeOnPressBack={false}
        // closeOnPressMask={false}
        // animationType="slide"
        height={200}
        closeOnPressMask={true}
        closeOnDragDown={true}
        customStyles={{
          container: {
            alignItems: 'center',
            borderRadius: 19,
          },
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
            onPress={() => this.setGender('Male')}>
            <Text
              style={{
                fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                fontWeight: 'bold',
                color: Constants.COLORS.whiteColor,
                fontFamily: Constants.FONTFAMILY.BOLD,
                marginLeft: 5,
              }}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setGender('Female')}
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
              Female
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
            //marginTop: heightToDp(5),
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
            //marginTop: heightToDp(5)
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

  renderCarasoul() {
    const {userName, usersData, isProfileCompleted, profile} = this.state;
    return (
      <>
        <Carousel
          ref={(c) => {
            this.carouselRef = c;
          }}
          currentScrollPosition={(data) => {
            console.log('onLayout', data);
          }}
          //onEndReached={() => this.loadMoreUser()}
          //onEndReachedThreshold={0.5}
          layout={'default'}
          //layoutCardOffset={`9`}
          data={profile}
          carouselRef={this.carouselRef}
          activeAnimationType="spring"
          //autoplay={true}
          //autoplayInterval={1000}
          renderItem={(item) => (
            <ProfileCarasoulView
              uploadImageControlWillVisible={true}
              willShowProfile={true}
              index={item.index}
              willImageClick={false}
              uploadImageClick={() => this.imageClick('CAMERA')}
              navigation={this.props.navigation}
              item={item.item}
            />
          )}
          sliderWidth={Constants.DIMESIONS.WINDOWWIDTH}
          itemWidth={Constants.DIMESIONS.WINDOWWIDTH / 1.3}
        />
      </>
    );
  }
  onOkPress() {
    this.setState({openCameraForCompletingProfile: false});
    setTimeout(() => {
      this.RBSheet.open();
    }, 1000);
  }
  handelPress() {
    this.setState({openCameraForCompletingProfile: false});
  }
  showUpgradeAlert() {
    this.setState({willShowUpgradeAlert: true});
  }
  onRequestClose() {
    this.setState({willShowUpgradeAlert: false});
  }
  onBackdropPress() {
    this.setState({isVisible: false});
  }
  onRequestCloseInformationView() {
    this.setState({isVisible: false});
  }

  render() {
    const {
      userName,
      age,
      isVisible,
      gender,
      about,
      profile,
      category,
      openCameraForCompletingProfile,
      nuzzlePoints,
      willShowUpgradeAlert,
      zipCode,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Modal
          animated={true}
          transparent={true}
          visible={this.props.showLoader || this.props.isLoading}>
          <Loader />
        </Modal>
        {/* <NeedNuzzlePointsView
          onRequestClose={() => alert('dd')}
          willShow={true}></NeedNuzzlePointsView> */}

        <Statusbar />
        {this.renderHeader()}
        {this.renderBottomSheet()}
        {this.renderGenderBottomSheet()}
        <InformAlertView
          textHeadingOne={Constants.STRING.CONGRATES_MANY_PHOTOS}
          textHeadingTwo={Constants.STRING.YOU_EARNED}
          //name={' Kira' + '.'}
          points={'+40'}
          nuzzlesText={Constants.STRING.NUZZLE_WITH_HUE}
          earningPoints={40}
          willButtonVisible={false}
          textHeadingThirdVisible={false}
          onRequestClose={() => this.onRequestCloseInformationView()}
          onBackdropPress={() => this.onBackdropPress()}
          isVisible={isVisible}></InformAlertView>

        {willShowUpgradeAlert ? (
          <>
            <SCLAlertView
              title={Constants.STRING.IMPROVEMENT}
              yesButtonHeading={'Ok'}
              noButtonHeading={'Cancel'}
              subtitle={Constants.STRING.UPGRADE}
              onRequestClose={() => this.onRequestClose()}
              willShow={willShowUpgradeAlert}></SCLAlertView>
          </>
        ) : null}
        {/* <View
          style={{
            height: 60,
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
              marginTop: heightToDp(2),
              textAlign: 'center',
              fontWeight: '600',
              lineHeight: 35,
            }}>
            {'Profile'}
          </Text>
        </View>
        */}
        <KeyboardAwareScrollView
          extraScrollHeight={200}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          {/* <TouchableOpacity
            onPress={() => this.imageClick()}
            style={{
              height: 120,
              alignSelf: 'center',
              width: 120,
              marginTop: 20,
              // alignItems: 'center',
            }}>
            <ImageBackground
              style={{height: 100, width: 100, alignSelf: 'center'}}
              resizeMode={'cover'}
              imageStyle={{borderRadius: 100 / 2}}
              source={{uri: profile}}
            />

            <Image
              style={{
                height: 23,
                width: 23,
                alignSelf: 'flex-end',
                marginTop: -30,
                marginRight: 15,
              }}
              source={ImageCostants.PROFILE.ADD}></Image>
          </TouchableOpacity> */}

          {this.renderCarasoul()}
          <TouchableOpacity
            onPress={() => this.showUpgradeAlert()}
            style={{
              backgroundColor: Constants.COLORS.buttonColor1,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              height: 50,
              paddingHorizontal: 20,
              //width: 150,
              marginTop: 20,
              //marginBottom: 50,
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 21,
                fontFamily: Constants.FONTFAMILY.BOLDITALIC,
                // marginTop: 20,
                textAlign: 'center',
              }}>
              {nuzzlePoints + ' NuZZles'}
            </Text>
          </TouchableOpacity>

          <View style={{marginTop: heightToDp(10), flexDirection: 'row'}}>
            <View style={{paddingHorizontal: 20, marginTop: 10, flex: 1}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'gray',
                  //marginTop: -10,
                  fontFamily: Constants.FONTFAMILY.BOLD,
                }}>
                {'FIRST NAME'}
              </Text>
              <TextInput
                placeholder={'John'}
                //keyboardType="email-address"
                value={userName}
                onChangeText={(userName) => this.setState({userName})}
                style={{
                  height: 42,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.9,
                  color: 'black',
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                  fontSize: 17,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}></TextInput>
            </View>
            {/* <View style={{flex: 1}}>
              <FloatingLabelInput
                label={'NAME'}
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
                  colorFocused: 'gray',
                  colorBlurred: 'gray',
                  fontSizeFocused: 15,
                }}
                labelStyles={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  //backgroundColor: '#fff',
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
                inputStyles={{
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.5,
                  color: 'gray',
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                  fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                }}
                hintTextColor={'gray'}
                customShowPasswordComponent={<Text>Show</Text>}
                customHidePasswordComponent={<Text>Hide</Text>}
              />
            </View> */}

            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => this.RBSheet1.open()}
                style={{
                  margin: 15,
                  height: 80,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'gray',
                    marginTop: -10,
                    fontFamily: Constants.FONTFAMILY.BOLD,
                  }}>
                  {'GENDER'}
                </Text>
                <Text
                  style={{
                    fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                    marginTop: heightToDp(5.9),
                    color: 'gray',
                  }}>
                  {gender}
                </Text>
                <View
                  style={{
                    height: 1,
                    //marginTop: heightToDp(4.1),
                    width: '100%',
                    backgroundColor: 'gray',
                  }}></View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{flex: 1}}>
              {/* <FloatingLabelInput
                label={'AGE'}
                value={age}
                //isPassword
                onChangeText={(age) => this.setState({age})}
                containerStyles={{
                  margin: 20,
                  flex: 0.5,
                  height: 80,
                }}
                customLabelStyles={{
                  colorFocused: 'gray',
                  colorBlurred: 'gray',
                  fontSizeFocused: 15,
                }}
                labelStyles={{
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  //backgroundColor: '#fff',
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
                inputStyles={{
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.5,
                  color: 'gray',
                  flex: 1,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 15,
                  fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                }}
                hintTextColor={'gray'}
                customShowPasswordComponent={<Text>Show</Text>}
                customHidePasswordComponent={<Text>Hide</Text>}
              /> */}
              <Dropdown
                style={{
                  marginTop: heightToDp(5),
                  paddingHorizontal: 10,
                  marginLeft: 20,
                  paddingVertical: 0,
                  backgroundColor: 'transparent',
                }}
                icon="chevron-down"
                iconColor="white"
                label="AGE"
                textColor={'gray'}
                fontSize={20}
                value={age}
                onChangeText={(age) => this.setState({age})}
                data={Constants.AGE_RANGE_ARRAY}
              />
            </View>
            <View style={{flex: 1}}>
              <Dropdown
                style={{
                  marginTop: heightToDp(5),
                  paddingHorizontal: 10,
                  marginLeft: 10,
                  marginRight: 20,
                  paddingVertical: 0,
                  backgroundColor: 'transparent',
                }}
                icon="chevron-down"
                iconColor="white"
                label="Category"
                textColor={'gray'}
                fontSize={20}
                value={category}
                onChangeText={(category, index, data) =>
                  this.setState({
                    category: category,
                    //  categoryId: data[index].id,
                  })
                }
                data={this.state.customFilterArray}
              />
            </View>
          </View>
          {openCameraForCompletingProfile && (
            <>
              <SCLAlertView
                willHaveTwoControl={true}
                title={Constants.STRING.IMPROVEMENT}
                yesButtonHeading={'Ok'}
                noButtonHeading={'Cancel'}
                subtitle={Constants.STRING.MOTIVATE_USER}
                onRequestClose={() => this.onOkPress()}
                handleClose={() => this.handelPress()}
                willShow={openCameraForCompletingProfile}></SCLAlertView>
            </>
          )}
          <View style={{marginTop: 30}}></View>
          {/* <FloatingLabelInput
            label={'BIO'}
            value={about}
            multiline
            numberOfLines={3}
            //isPassword
            onChangeText={(about) => this.setState({about})}
            //onFocus={focus}
            //onBlur={blur}
            //isFocused={focused}
            containerStyles={{
              margin: 20,
              backgroundColor: 'transparent',
              height: 150,
            }}
            customLabelStyles={{
              colorFocused: 'gray',
              colorBlurred: 'gray',
              fontSizeFocused: 15,
            }}
            labelStyles={{
              fontFamily: Constants.FONTFAMILY.BOLD,
              //backgroundColor: '#fff',
              paddingHorizontal: 5,
              paddingVertical: 10,
            }}
            inputStyles={{
              fontFamily: Constants.FONTFAMILY.REGULAR,
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              color: 'gray',
              paddingVertical: 0,
              paddingHorizontal: 10,
              marginTop: 15,
              fontSize: Constants.FONTSIZE.BaseFontSize - 3,
            }}
            hintTextColor={'gray'}
            customShowPasswordComponent={<Text>Show</Text>}
            customHidePasswordComponent={<Text>Hide</Text>}
          /> */}
          <Text style={{margin: 0, color: 'gray', marginHorizontal: 30}}>
            ZIPCODE
          </Text>
          <TextInput
            maxLength={6}
            keyboardType="number-pad"
            value={this.state.zipCode ? this.state.zipcode : ''}
            editable={false}
            onChangeText={(zipCode) => this.setState({zipCode})}
            style={{
              fontFamily: Constants.FONTFAMILY.REGULAR,
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              color: 'gray',
              marginHorizontal: 25,
              marginTop: 15,
              backgroundColor: 'transparent',
              height: 45,
              fontSize: Constants.FONTSIZE.BaseFontSize - 3,
            }}></TextInput>
          <Text
            style={{
              margin: 0,
              color: 'gray',
              marginHorizontal: 30,
              marginTop: 15,
            }}>
            ABOUT
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={about}
            onChangeText={(about) => this.setState({about})}
            style={{
              fontFamily: Constants.FONTFAMILY.REGULAR,
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              color: 'gray',
              marginHorizontal: 20,
              marginTop: 15,
              //margin: 20,
              backgroundColor: 'transparent',
              height: 100,
              fontSize: Constants.FONTSIZE.BaseFontSize - 3,
            }}></TextInput>
          <Pressable
            onPress={() => this.onUpdateProfileClick()}
            style={{
              backgroundColor: Constants.COLORS.buttonColor1,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              height: 50,
              marginTop: 15,
              width: 150,
              marginBottom: 50,
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 17,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {'UPDATE'}
            </Text>
          </Pressable>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  showLoader: state.updateUserReducer.showLoader,
  isLoading: state.getUserProfileReducer.isLoading,
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
});

//redux function for edit profile and get profile
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      UpdateUserActionTo: bindActionCreators(UpdateUserAction, dispatch),
      GetUserProfileActionTo: bindActionCreators(
        GetUserProfileAction,
        dispatch,
      ),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
