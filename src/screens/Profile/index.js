import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  Switch,
  StatusBar,
  ImageBackground,
  Modal,
  Animated,
  TouchableOpacity,
} from 'react-native';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar, widthToDp} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
import {SliderBox} from 'react-native-image-slider-box';
import * as GetUserProfileAction from '../../redux/actions/GetUserProfileAction';
import * as LikeDislikeAction from '../../redux/actions/LikeDislikeAction';
import {connect} from 'react-redux';
import commonUtility from '../../../src/frequent/Utility/CommonUtility';
import {bindActionCreators} from 'redux';
import {Loader} from '../../frequent/Utility/Loader';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 100 : 80;

import * as NuzzlePointsAction from '../../redux/actions/NuzzlePointsAction';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      age: '',
      city: '',
      description: '',
      location: '',
      avatarSource: [],
      anotherUserId: this.props.route.params.id
        ? this.props.route.params.id
        : null,
      anotherUserName: this.props.route.params.name,
      anotherUserProfile: this.props.route.params.profile_pic,
      isLiked: this.props.route.params.isLiked,
    };
    this.shakeAnimation = new Animated.Value(0);
  }

  componentDidMount() {
    // var oldTime = 1616407737139;
    // var today = new Date();
    // var date =
    //   today.getDate() +
    //   '/' +
    //   parseInt(today.getMonth() + 1) +
    //   '/' +
    //   today.getFullYear();
    // console.log(date);
    // var oldDate = '21/3/2021';
    //console.log(today.getTime());
    //alert(date == oldDate);
    this.getUserInfo();
  }

  checkHaveFreeMatchRequest = async () => {
    //alert('InProgress');
    // let [date] = await Promise.all([
    //   commonUtility.getStoreData(Constants.STRING.GET_DATE),
    // ]);
    // alert(date);
  };

  onHeadToToePress = () => {
    const {id} =
      this.props.userLoginData == undefined
        ? this.props.userRegisterData || this.props.userVarifyData
        : this.props.userRegisterData || this.props.userLoginData;
    const formData = new FormData();
    formData.append('first_uid', id);
    formData.append('first_uid_points', '20');
    formData.append('first_points_type', '1');
    formData.append('secound_uid', this.state.anotherUserId);
    formData.append('secound_uid_points', '40');
    formData.append('secound_points_type', '1');
    this.props.actions.addNuzzlePoints.nuzzlePointsRequest(
      formData,
      this.onPopUserSuccess,
      this.onPopUserFailure,
    );
  };

  onPopUserSuccess = async (responseData) => {
    console.log('  onPopUserSuccess', JSON.stringify(responseData));
    if (responseData) {
      setTimeout(() => {
        commonUtility.displayToast(
          'Congrates you have successfully Head-To-Teo.',
        );
      }, 100);
    }
  };

  onPopUserFailure = async (error) => {
    setTimeout(() => {
      commonUtility.displayToast(error);
    }, 100);

    console.log('nuzzleUpDelete  onPopUserFailure', JSON.stringify(error));
  };
  getUserInfo = async () => {
    const formData = new FormData();
    formData.append(ApiConstants.USER_PROFILE_INFO, this.state.anotherUserId);
    this.props.actions.GetUserProfileActionTo.getProfileRequest(
      formData,
      this._onSuccessInfo,
      this._onFailureInfo,
    );
  };

  _onSuccessInfo = async (responsedata) => {
    console.log('_ONSUCCESS', JSON.stringify(responsedata));
    var response = responsedata.data;
    //userinformation variables
    var userName = response.name;
    var age = response.age;
    var profile = response.profile_pic;
    var about = response.bio;
    var email = response.email;
    var genderId = response.gender;
    var city = response.city;
    this.setState({
      name: userName,
      age: age,
      description: about,
      avatarSource: profile,
      city: city,
    });
  };

  _onFailureInfo = async (error) => {
    console.log('_ONFAILURE', JSON.stringify(error));
  };

  startShakeForLike = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  ////like  request begins////
  onLikePress = async (Action) => {
    const {id} =
      this.props.userLoginData ||
      this.props.userRegisterData ||
      this.props.userVarifyData;
    const {anotherUserId} = this.state;
    ///request
    const formData = new FormData();
    formData.append(ApiConstants.ANOTHER_UID, anotherUserId);
    formData.append(ApiConstants.LIKE, Action);
    formData.append(ApiConstants.UID, id);
    this.props.actions.LikeDislikeActionTo.likeDislikeRequest(
      formData,
      this._onSuccessLikeRequest,
      this._onFailureLikeRequest,
    );
  };

  _onSuccessLikeRequest = async (responsedata) => {
    const {anotherUserId, anotherUserName, anotherUserProfile, isLiked} =
      this.state;
    var userMatchStatus = isLiked;
    var id = anotherUserId;
    var name = anotherUserName;
    var profile_pic = anotherUserProfile;
    var userDetailsObject = {
      id: id,
      name: name,
      profile_pic: profile_pic,
    };

    if (userMatchStatus == ApiConstants.LIKED) {
      setTimeout(() => {
        this.props.navigation.navigate(
          Constants.ROUTENAME.MATCH,
          userDetailsObject,
        );
      }, 100);
    } else {
      setTimeout(() => {
        commonUtility.navigateToPleaseLogInfirst(
          this.props,
          Constants.ROUTENAME.HOME,
        );
      }, 100);
    }
  };

  _onFailureLikeRequest = async (error) => {
    console.log('_onFailureLikeDislike=>', error);
    setTimeout(() => {
      commonUtility.displayToast('Something going wrong.');
    }, 100);
    //alert(JSON.stringify(error));
  };

  renderHeader() {
    const {anotherUserId, anotherUserProfile, anotherUserName} = this.state;
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          //marginTop: heightToDp(5),
          backgroundColor: Constants.COLORS.transparent,
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
            borderColor: 'gray',
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
            // marginTop: heightToDp(10),
          }}>
          <ImageBackground
            style={{height: 50, width: 120, alignSelf: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.NUZZELWHITETEXT}></ImageBackground>
        </View>
        <Animated.View style={{transform: [{translateX: this.shakeAnimation}]}}>
          <TouchableOpacity
            onPress={() => [this.onLikePress(1), this.startShakeForLike()]}
            style={{
              height: 40,
              width: 40,
              // marginTop: heightToDp(10),
            }}>
            <ImageBackground
              style={{height: 40, width: 40, justifyContent: 'center'}}
              resizeMode="contain"
              source={ImageCostants.SPLASH.HEART}></ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
  render() {
    const {name, age, location, description, avatarSource, city} = this.state;
    return (
      <View style={{flex: 1}}>
        <Statusbar />
        {this.renderHeader()}
        <Modal
          animated={true}
          transparent={true}
          visible={
            this.props.isLoading || this.props.isLoadingnuzzlePointsReducer
          }>
          <Loader />
        </Modal>
        <ScrollView>
          <TouchableOpacity
            onPress={() => this.onHeadToToePress()}
            style={{
              height: 40,
              width: 40,
              position: 'absolute',
              zIndex: 1,
              margin: 20,
              // marginLeft: 0,
              // padding: 20,
              //alignSelf: 'flex-end',
              alignItems: 'center',
              marginLeft: widthToDp(86),
              justifyContent: 'center',
              backgroundColor: Constants.COLORS.buttonColor1,
              borderRadius: 40 / 2,
            }}>
            <ImageBackground
              style={{
                height: 23,
                width: 23,
              }}
              resizeMode="contain"
              source={ImageCostants.PROFILE.HEADTOTOE}></ImageBackground>
          </TouchableOpacity>

          <SliderBox
            style={{
              height:
                Constants.DIMESIONS.WIDOWHEIGHT < 800
                  ? heightToDp(70)
                  : heightToDp(90),
            }}
            sliderBoxHeight={heightToDp(110)}
            dotColor={Constants.COLORS.whiteColor}
            inactiveDotColor="#90A4AE"
            images={avatarSource}></SliderBox>

          <Text
            style={{
              color: Constants.COLORS.buttonColor1,
              fontSize: 35,
              fontFamily: Constants.FONTFAMILY.BOLD,
              marginTop: 20,
              textAlign: 'center',
            }}>
            {name + ', ' + age}
          </Text>

          <Text
            style={{
              color: Constants.COLORS.buttonColor1,
              fontSize: 14,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              marginTop: 10,
              textAlign: 'center',
            }}>
            {city}
          </Text>
          <Text
            style={{
              color: Constants.COLORS.blackColor,
              fontSize: 14,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              marginTop: 25,
              textAlign: 'center',
              paddingHorizontal: 20,
            }}>
            {description}
          </Text>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state.getUserProfileReducer.isLoading,
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
  nuzzlePointsReducer: state.nuzzlePointsReducer.userData,
  isLoadingnuzzlePointsReducer: state.nuzzlePointsReducer.showLoader,
});

//redux function for edit profile and get profile
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      GetUserProfileActionTo: bindActionCreators(
        GetUserProfileAction,
        dispatch,
      ),
      LikeDislikeActionTo: bindActionCreators(LikeDislikeAction, dispatch),
      addNuzzlePoints: bindActionCreators(NuzzlePointsAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
