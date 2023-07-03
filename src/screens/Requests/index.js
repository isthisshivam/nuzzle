import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  TextInput,
  Text,
  FlatList,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Constants from '../../frequent/Constants';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar, StatusbarA} from '../../frequent/Utility/Utils';
import {bindActionCreators} from 'redux';
import * as LikeDislikeAction from '../../redux/actions/LikeDislikeAction';
import * as LikedUsersActions from '../../redux/actions/LikedUsers';
import * as NuzzleUpDeleteAction from '../../redux/actions/NuzzleUpDeleteAction';
import {connect} from 'react-redux';
import LoaderComponent from '../../components/LoaderComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import InformAlertView from '../../components/InformAlertView';
var userId = null;
class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      another_uid_to_delete: '',
      nuzzleUpUserArray: [],
      isSurveyRBSheetVisible: true,
      isVisible: false,
      offset: 1,
      totalPage: 1,
    };
  }

  componentDidMount = async () => {
    this.getUserId();
    await this.props.navigation.addListener('focus', () => {
      this.setState({nuzzleUpUserArray: []});
      this.getUserId();
    });
  };
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
    this.getNuzzleUpUsers();
  };
  getNuzzleUpUsers = async () => {
    const formData = new FormData();
    formData.append(ApiConstants.UID, userId);
    formData.append('current_page', this.state.offset);
    this.props.actions.getLikedusersList.likedUserRequest(
      formData,
      this.onLoadNuzzleUpUser,
      this.onFailedNuzzleUpUser,
    );
  };

  onLoadNuzzleUpUser = async (responseData) => {
    const {nuzzleUpUserArray} = this.state;
    var usersData = responseData.data.items;
    let totalPage = responseData.data.total_pages;
    console.log('onLoadNuzzleUpUser', usersData);
    this.setState({
      totalPage: totalPage == '0' ? 1 : totalPage,
      nuzzleUpUserArray:
        this.state.offset == 1
          ? usersData
          : [...this.state.nuzzleUpUserArray, ...usersData],
    });
    console.log('nuzzleUp', nuzzleUpUserArray);
  };

  onEndReached = () => {
    const {totalPage, offset} = this.state;
    if (offset != totalPage) {
      this.setState(
        {
          offset: this.state.offset + 1,
        },
        () => {
          this.getNuzzleUpUsers();
        },
      );
    } else {
    }
  };

  onFailedNuzzleUpUser = async (error) => {
    console.log('nuzzleUp error', JSON.stringify(error));
  };

  // deleteNuzzleUpUsers = async (userId, another_uid) => {
  //   this.setState({another_uid_to_delete: another_uid});
  //   const formData = new FormData();
  //   formData.append(ApiConstants.UID, userId);
  //   formData.append(ApiConstants.ANOTHER_UID, another_uid);
  //   this.props.actions.deleteNuzzleUpUsersTo.nuzzleUpDeleteRequest(
  //     formData,
  //     this.onPopUserSuccess,
  //     this.onPopUserFailure,
  //   );
  // };

  // onPopUserSuccess = async (responseData) => {
  //   console.log(
  //     'nuzzleUpDelete  onPopUserSuccess',
  //     JSON.stringify(responseData),
  //   );
  //   this.popUserFromList(this.state.another_uid_to_delete);
  // };

  // onPopUserFailure = async (error) => {
  //   console.log('nuzzleUpDelete  onPopUserFailure', JSON.stringify(error));
  // };

  onLikeDislikePress = async (Action, activeSlide) => {
    // if (Action == 1) {
    //   this.carouselRef.snapToNext(true, false);
    //   //this.setState({activeSlide: this.state.activeSlide + 1});
    // } else {
    //   this.carouselRef.snapToPrev(true, false);
    //   //this.setState({activeSlide: this.state.activeSlide - 1});
    // }

    const {nuzzleUpUserArray} = this.state;
    const {id} =
      this.props.userLoginData ||
      this.props.userVerifyData ||
      this.props.userRegisterData;

    var anotherId = nuzzleUpUserArray[activeSlide].uid;
    //  var already_like_status = usersData[activeSlide].like;
    ///request
    const formData = new FormData();
    formData.append(ApiConstants.ANOTHER_UID, anotherId);
    formData.append(ApiConstants.LIKE, Action);
    formData.append(ApiConstants.UID, id);
    formData.append(ApiConstants.ALREADY_LIKED, Action);
    this.props.actions.LikeDislikeActionTo.likeDislikeRequest(
      formData,
      this._onSuccessLikeDislike,
      this._onFailureLikeDislike,
    );
  };

  _onSuccessLikeDislike = async (responsedata) => {
    console.log('_onSuccessLikeDislike===', responsedata);
    const {activeSlide, usersData} = this.state;
    this.getNuzzleUpUsers();
  };

  _onFailureLikeDislike = async (error) => {
    console.log('_onFailureLikeDislike=>', error);
    setTimeout(() => {
      commonUtility.displayToast('Something going wrong.');
    }, 100);
  };

  ///delete user  based on another_uid from list
  popUserFromList = (id) => {
    const filteredData = this.state.nuzzleUpUserArray.filter(
      (item) => item.another_uid !== id,
    );
    this.setState({nuzzleUpUserArray: filteredData});
  };

  onBackdropPress() {
    this.setState({isVisible: false});
  }
  onRequestClose() {
    this.setState({isVisible: false});
  }
  onAccept() {
    this.onRequestClose();
    this.RBSheet.open();
  }
  renderHeader() {
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          marginTop: Platform.OS === 'ios' ? heightToDp(8) : heightToDp(1),
          backgroundColor: Constants.COLORS.transparent,
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
        }}>
        <TouchableOpacity
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
        </TouchableOpacity>

        <View style={{flex: 1, alignItems: 'center'}}>
          <ImageBackground
            style={{height: 50, width: 120, alignSelf: 'center'}}
            resizeMode="contain"
            source={ImageCostants.SPLASH.NUZZELWHITETEXT}></ImageBackground>
        </View>

        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    );
  }

  renderItem(item) {
    const {profile_pic, another_uid, uid, name, age, city} = item.item;
    console.log('renderItem', item.item);
    const {nuzzleUpUserArray} = this.state;
    return (
      <View
        style={{
          // flexDirection: 'row',
          alignItems: 'center',
          // borderBottomWidth: nuzzleUpUserArray.length > 1 ? 0.5 : 0,
        }}>
        <View
          style={{
            height: 120,
            // backgroundColor: 'gray',
            marginTop: 20,
            //  marginRight: 20,
            flexDirection: 'row',
            paddingHorizontal: 5,
            alignItems: 'center',
            borderBottomColor: 'white',
          }}>
          <TouchableOpacity>
            <ImageBackground
              style={{
                height: 70,
                width: 70,
              }}
              imageStyle={{borderRadius: 100 / 2}}
              resizeMode={'cover'}
              source={{uri: profile_pic}}></ImageBackground>
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 10,
              width: '70%',
              height: '100%',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 25,
                fontFamily: Constants.FONTFAMILY.BOLD,
              }}>
              {name}
            </Text>
            <Text
              style={{
                color: Constants.COLORS.greyLight,
                marginTop: 5,
                fontSize: 15,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {age}
            </Text>
            <Text
              style={{
                color: Constants.COLORS.greyLight,
                fontSize: 15,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {city}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 20,
            height: 50,
            paddingHorizontal: 20,
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => this.onLikeDislikePress(1, item.index)}
            style={{
              height: 45,
              width: 140,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Constants.COLORS.buttonColor2,
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 16,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {`Let's Nuzzle Up`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onLikeDislikePress(2, item.index)}
            style={{
              marginLeft: 20,
              height: 45,
              width: 120,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Constants.COLORS.buttonColor2,
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 16,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {`May be later`}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
       
          onPress={() => this.setState({isVisible: true})}>
          <ImageBackground
            style={{
              height: 30,
              width: 30,
            }}
            resizeMode="contain"
            source={ImageCostants.NUZZLEUP.CROSS}></ImageBackground>
        </TouchableOpacity> */}
      </View>
    );
  }
  emptyView() {
    return (
      <TouchableOpacity
        style={{
          height: Constants.DIMESIONS.WIDOWHEIGHT,
          flex: 1,
          marginTop: heightToDp(60),
          alignItems: 'center',
        }}>
        <Text style={{color: Constants.COLORS.whiteColor, alignSelf: 'center'}}>
          No Notifications
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <Image
            style={{height: 20, width: 20, marginLeft: 3}}
            source={ImageCostants.NUZZLEUP.SMILE}></Image>
        </View>
      </TouchableOpacity>
    );
  }
  renderBottomSheet() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={height}
        openDuration={250}
        customStyles={{
          container: {
            //justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        <View
          style={{
            height: 70,
            flexDirection: Constants.STRING.ROW,
            marginTop: Platform.OS === 'ios' ? heightToDp(8) : heightToDp(1),
            backgroundColor: Constants.COLORS.transparent,
            paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
            alignItems: Constants.STRING.CENTER,
          }}>
          <TouchableOpacity
            onPress={() => this.RBSheet.close()}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              // borderRadius: 40 / 2,
              // borderColor: 'white',
              //borderWidth: 1,
            }}>
            <ImageBackground
              style={{height: 23, width: 23, justifyContent: 'center'}}
              resizeMode="contain"
              source={ImageCostants.SPLASH.CROSS}></ImageBackground>
          </TouchableOpacity>

          <View style={{flex: 1, alignItems: 'center'}}></View>
        </View>
      </RBSheet>
    );
  }
  render() {
    const {userName, nuzzleUpUserArray, isSurveyRBSheetVisible, isVisible} =
      this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* <StatusbarA /> */}
        <ImageBackground
          style={{
            height: Constants.DIMESIONS.height,
            width: Constants.DIMESIONS.width,
            flex: 1,
          }}
          source={ImageCostants.SPLASH.PATHBACKGROUND}>
          {this.renderHeader()}
          <View
            style={{
              height: 40,
              flexDirection: Constants.STRING.ROW,
              marginTop: heightToDp(4),
              backgroundColor: Constants.COLORS.transparent,
              paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
              justifyContent: Constants.STRING.CENTER,
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 35,
                textAlign: 'center',
                fontFamily: Constants.FONTFAMILY.BOLD,
                lineHeight: 35,
              }}>
              {'Notifications'}
            </Text>
          </View>
          <InformAlertView
            textHeadingOne={'You unmatched with'}
            textHeadingTwo={
              'Take a quick, 5 question survey on why you unmatched to earn '
            }
            name={' Kira' + '.'}
            points={'+30'}
            nuzzlesText={' nuzzles?'}
            earningPoints={30}
            willButtonVisible={true}
            textHeadingThirdVisible={false}
            onAccepted={() => this.onAccept()}
            onRequestClose={() => this.onRequestClose()}
            onBackdropPress={() => this.onBackdropPress()}
            isVisible={isVisible}></InformAlertView>

          <LoaderComponent isLoading={this.props.isLoading}></LoaderComponent>
          {this.renderBottomSheet()}

          <FlatList
            contentContainerStyle={{paddingHorizontal: 20}}
            data={nuzzleUpUserArray}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => this.emptyView()}
            onEndReached={() => this.onEndReached()}
            renderItem={(item) => this.renderItem(item)}></FlatList>
        </ImageBackground>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state.likedUsersReducer.isLoading,
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
  showLoaderLikeDislike: state.likeDislikeReducer.showLoaderLikeDislike,
});

//redux function for edit profile and get profile
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      getLikedusersList: bindActionCreators(LikedUsersActions, dispatch),
      LikeDislikeActionTo: bindActionCreators(LikeDislikeAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
