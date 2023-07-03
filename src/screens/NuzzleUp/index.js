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
import * as NuzzleUpAction from '../../redux/actions/NuzzleUpAction';
import * as NuzzleUpDeleteAction from '../../redux/actions/NuzzleUpDeleteAction';
import {connect} from 'react-redux';
import LoaderComponent from '../../components/LoaderComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import InformAlertView from '../../components/InformAlertView';
import Questions from '../../components/Questions';
var userId = null;
class NuzzleUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      another_uid_to_delete: '',
      nuzzleUpUserArray: [],
      isSurveyRBSheetVisible: true,
      isVisible: false,
      isVisibleCongratulation: false,
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
    this.props.actions.getNuzzleUpUsersTo.nuzzleUpRequest(
      formData,
      this.onLoadNuzzleUpUser,
      this.onFailedNuzzleUpUser,
    );
  };

  onLoadNuzzleUpUser = async (responseData) => {
    const {nuzzleUpUserArray} = this.state;
    //console.log('nuzzleUp', JSON.stringify(responseData));
    var dataArray = responseData.data.items;
    console.log('onLoadNuzzleUpUser', dataArray);
    this.setState({nuzzleUpUserArray: dataArray});
  };

  onFailedNuzzleUpUser = async (error) => {
    console.log('nuzzleUp error', JSON.stringify(error));
  };

  deleteNuzzleUpUsers = async (userId, another_uid) => {
    this.setState({another_uid_to_delete: another_uid});
    const formData = new FormData();
    formData.append(ApiConstants.UID, userId);
    formData.append(ApiConstants.ANOTHER_UID, another_uid);
    this.props.actions.deleteNuzzleUpUsersTo.nuzzleUpDeleteRequest(
      formData,
      this.onPopUserSuccess,
      this.onPopUserFailure,
    );
  };

  onPopUserSuccess = async (responseData) => {
    console.log(
      'nuzzleUpDelete  onPopUserSuccess',
      JSON.stringify(responseData),
    );
    this.popUserFromList(this.state.another_uid_to_delete);
  };

  onPopUserFailure = async (error) => {
    console.log('nuzzleUpDelete  onPopUserFailure', JSON.stringify(error));
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
    this.refRBSheet.open();
  }
  openAnotherUserProfile = (user) => {
    console.log('openAnotherUserProfile.props=', this.props.route.params);
    const {profile_pic, another_uid, uid, name, age, city} = user;
    var userDetailsObject = {
      id: another_uid,
      name: name,
      userMatchStatus: 1,
      profile_pic: profile_pic,
    };
    this.props.navigation.navigate(
      Constants.ROUTENAME.PROFILE,
      userDetailsObject,
    );
  };
  onSurveyComplete = async () => {
    this.refRBSheet.close();
    setTimeout(() => {
      this.setState({isVisibleCongratulation: true});
    }, 400);
  };
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
    console.log('openAnotherUserProfile.props=', item.item);
    const {profile_pic, another_uid, uid, name, age, city} = item.item;
    const {nuzzleUpUserArray} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => this.openAnotherUserProfile(item.item)}
          style={{
            height: 110,
            backgroundColor: 'transparent',
            marginTop: 20,
            marginRight: 20,
            flexDirection: 'row',
            paddingHorizontal: 5,
            alignItems: 'center',
            borderBottomColor: 'white',
            borderBottomWidth: nuzzleUpUserArray.length > 1 ? 0.5 : 0,
          }}>
          <ImageBackground
            style={{
              height: 70,
              width: 70,
            }}
            imageStyle={{borderRadius: 100 / 2}}
            resizeMode={'cover'}
            source={{uri: profile_pic}}></ImageBackground>
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
        </TouchableOpacity>
        <TouchableOpacity
          //onPress={() => this.deleteNuzzleUpUsers(uid, another_uid)}
          // onPress={() => this.RBSheet.open()}
          onPress={() => this.setState({isVisible: true})}>
          <ImageBackground
            style={{
              height: 30,
              width: 30,
            }}
            resizeMode="contain"
            source={ImageCostants.NUZZLEUP.CROSS}></ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
  renderSurveyPopUp() {
    return (
      <>
        <RBSheet
          ref={(ref) => {
            this.refRBSheet = ref;
          }}
          // closeOnPressMask={closeOnPressMask}
          animationType={'slide'}
          height={430}
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
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 30,
                //justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: Constants.COLORS.dividerDark,
                  fontFamily: Constants.FONTFAMILY.BOLD,
                  // fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {'Survey'}
              </Text>
            </View>

            <Questions
              userId={userId}
              onComplete={() => this.onSurveyComplete()}></Questions>
          </View>
        </RBSheet>
      </>
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
          No User's yet!
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
    const {
      userName,
      nuzzleUpUserArray,
      isSurveyRBSheetVisible,
      isVisible,
      isVisibleCongratulation,
    } = this.state;
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
              {'Matches'}
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

          <InformAlertView
            textHeadingOne={Constants.STRING.CONGRATES_SURVEY1}
            textHeadingTwo={Constants.STRING.YOU_EARNED}
            points={'+40'}
            nuzzlesText={Constants.STRING.NUZZLE_WITH_HUE}
            earningPoints={40}
            willButtonVisible={false}
            textHeadingThirdVisible={false}
            onRequestClose={() =>
              this.setState({isVisibleCongratulation: false})
            }
            onBackdropPress={() =>
              this.setState({isVisibleCongratulation: false})
            }
            isVisible={isVisibleCongratulation}></InformAlertView>

          <LoaderComponent
            isLoading={
              this.props.isLoading || this.props.isLoadingUserPop
            }></LoaderComponent>
          {this.renderSurveyPopUp()}

          <FlatList
            contentContainerStyle={{paddingHorizontal: 20}}
            data={nuzzleUpUserArray}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => this.emptyView()}
            renderItem={(item) => this.renderItem(item)}></FlatList>
        </ImageBackground>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state.nuzzleUpReducer.isLoading,
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
  isLoadingUserPop: state.nuzzleUpDeleteReducer.isLoading,
});

//redux function for edit profile and get profile
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      getNuzzleUpUsersTo: bindActionCreators(NuzzleUpAction, dispatch),
      deleteNuzzleUpUsersTo: bindActionCreators(NuzzleUpDeleteAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NuzzleUp);
