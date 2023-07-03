import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Switch,
  Modal,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  PlatformColor,
  Platform,
} from 'react-native';

import {connect} from 'react-redux';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar, isSignedIn} from '../../frequent/Utility/Utils';
import firebase from '@react-native-firebase/app';
import LoaderComponent from '../../components/LoaderComponent';
import firestore from '@react-native-firebase/firestore';
import SearchBar from 'react-native-search-bar';
import InformAlertView from '../../components/InformAlertView';
import SCLAlertView from '../../components/SCLAlertView';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Questions from '../../components/Questions';
var refArray = [];
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageArray: [],
      userId: null,
      isLoading: false,
      isSearchBarVisible: false,
      surveyQuestionrate: true,
      willShow: false,
      isVisibleCongratulation: false,
      isLoggedIn: false,
    };
  }

  componentDidMount = async () => {
    await this.props.navigation.addListener('focus', () => {
      console.log(
        'global.surveyQuestionrateVisible',
        global.surveyQuestionrateVisible,
      );

      isSignedIn(
        this.props.userLoginData ||
          this.props.userVerifyData ||
          this.props.userRegisterData,
      ).then((res) => {
        if (res) {
          this.setState({isLoggedIn: true}, () => {
            this.getUserId();
          });
        } else {
          this.setState({isLoggedIn: false}, () => {
            this.getUserId();
          });
        }
      });
    });
  };

  componentWillUnmount = () => {
    console.log('componentWillMount');
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('Component received new props', nextProps);
  }
  onCancelButtonPress() {
    this.setState({isSearchBarVisible: false});
  }
  onChangeText(text) {
    const filteredUsers = refArray.filter((item) => {
      const itemData = `${item.LatestMessage.receiver_name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({messageArray: filteredUsers});
  }
  onSearchButtonPress() {
    return;
  }

  getUserId() {
    if (
      this.props.userLoginData ||
      this.props.userVarifyData ||
      this.props.userRegisterData != undefined
    ) {
      const {id} =
        this.props.userLoginData == undefined
          ? this.props.userRegisterData || this.props.userVarifyData
          : this.props.userRegisterData || this.props.userLoginData;

      this.setState({userId: id}, () => {
        this.pullLatestChat();
      });
    }
  }

  pullLatestChat = async () => {
    const {userId, messageArray} = this.state;
    this.setState({isLoading: true});
    ///working code  for listing data and chats
    await firebase
      .firestore()
      .collection(Constants.STRING.MESSAGES)
      .get()
      .then((querySnapshot) => {
        this.setState({isLoading: false});
        querySnapshot.forEach((documentSnapshot) => {
          console.log(
            'pullLatestChat querySnapshot=>',
            documentSnapshot.data().LatestMessage,
          );
          var id = documentSnapshot.id;
          var isUserIncludes = id.includes(this.state.userId);
          if (isUserIncludes) {
            messageArray.push(documentSnapshot.data());
            this.setState({
              isLoading: false,
              surveyQuestionrate:
                global.surveyQuestionrateVisible && this.state.isLoggedIn
                  ? global.surveyQuestionrateVisible
                  : false,
            });
          }
          console.log('messageArray', messageArray);
        });
      });
    // i have to set data in a const variable
    // just because i need t search data from this array
    refArray = messageArray;
  };
  disableSurveyService = async () => {
    global.surveyQuestionrateVisible = false;
  };
  onSurveyComplete = async () => {
    this.refRBSheet.close();
    setTimeout(() => {
      this.setState({isVisibleCongratulation: true});
    }, 400);
  };

  renderHeader() {
    const {isSearchBarVisible} = this.state;
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          marginTop: heightToDp(0),
          backgroundColor: Constants.COLORS.buttonColor2,
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
          justifyContent: 'center',
        }}>
        {isSearchBarVisible ? (
          <>
            <SearchBar
              searchBarStyle="minimal"
              hideBackground={true}
              style={{
                color: Constants.COLORS.buttonColor2,
                flex: 1,
                width: 120,
                height: 50,
                backgroundColor: Constants.COLORS.buttonColor2,
                marginRight: 30,
                borderRadius: 20,
              }}
              textColor={
                Platform.OS === 'ios' ? 'white' : Constants.COLORS.buttonColor2
              }
              keyboardAppearance="dark"
              ref={(refs) => (this.searchBar = refs)}
              placeholder="Search Messages"
              tintColor="white"
              showsCancelButtonWhileEditing={true}
              placeholderTextColor="white"
              onChangeText={(text) => this.onChangeText(text)}
              onSearchButtonPress={this.onSearchButtonPress()}
              onCancelButtonPress={() => this.onCancelButtonPress()}
            />
            {/* <View style={{flex: 1}}></View> */}
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => this.setState({isSearchBarVisible: true})}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                //marginTop: heightToDp(10),
                borderRadius: 40 / 2,
                borderColor: 'gray',
                borderWidth: 1.5,
              }}>
              <ImageBackground
                style={{height: 23, width: 40, justifyContent: 'center'}}
                resizeMode="contain"
                source={ImageCostants.SPLASH.SEARCH}></ImageBackground>
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
          </>
        )}

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(Constants.ROUTENAME.SETTING)
          }
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            //marginTop: heightToDp(10),
            // borderRadius: 40 / 2,
            //borderColor: 'white',
            //borderWidth: 1,
          }}>
          <ImageBackground
            style={{height: 40, width: 40, alignSelf: 'center'}}
            resizeMode="contain"
            source={ImageCostants.NUZZLEUP.SETTING}></ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }

  renderRow(item) {
    const {
      created_at,
      message,
      sender_id,
      receiver_id,
      receiver_image,
      receiver_name,
      sender_name,
      sender_profile,
      type,
      image,
      another_user_fcm_tkn,
    } = item.item.LatestMessage;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(Constants.ROUTENAME.CHATTING, {
            id: this.state.userId != sender_id ? sender_id : receiver_id,
            name: this.state.userId != sender_id ? sender_name : receiver_name,
            profile_pic:
              this.state.userId != sender_id ? sender_profile : receiver_image,
            another_user_fcm_tkn: another_user_fcm_tkn,
            route: 'CHAT',
          })
        }
        style={{
          borderBottomWidth: this.state.messageArray.length == 1 ? 0 : 0.5,
          height: 110,
          backgroundColor: 'white',
          marginTop: 10,
          flexDirection: 'row',
          paddingHorizontal: 5,
          alignItems: 'center',
        }}>
        {this.state.userId != sender_id ? (
          <ImageBackground
            style={{
              height: 70,
              width: 70,
              backgroundColor: Constants.COLORS.greyLight,
              borderRadius: 100 / 2,
            }}
            imageStyle={{borderRadius: 100 / 2}}
            resizeMode={'cover'}
            source={{
              uri: Array.isArray(sender_profile)
                ? sender_profile[0]
                : sender_profile,
            }}></ImageBackground>
        ) : (
          <ImageBackground
            style={{
              height: 70,
              width: 70,
            }}
            imageStyle={{borderRadius: 100 / 2}}
            resizeMode={'cover'}
            source={{
              uri: Array.isArray(receiver_image)
                ? receiver_image[0]
                : receiver_image,
            }}></ImageBackground>
        )}

        <View
          style={{
            marginLeft: 20,
            width: '75%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              height: 30,
              flexDirection: 'row',
              backgroundColor: Constants.COLORS.transparent,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{fontSize: 17, fontFamily: Constants.FONTFAMILY.REGULAR}}>
              {this.state.userId != sender_id ? sender_name : receiver_name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: Constants.COLORS.seeyouback,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {/* {moment(created_at).format('h:mm: a')} */}
              {moment(created_at).calendar()}
            </Text>
          </View>
          {type == 'text' && (
            <Text
              numberOfLines={2}
              style={{
                fontSize: 15,
                color: Constants.COLORS.seeyouback,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {message}
            </Text>
          )}
          {type == 'image' && (
            <ImageBackground
              style={{height: 40, width: 40}}
              imageStyle={{borderRadius: 4}}
              resizeMode="cover"
              source={{
                uri: image,
              }}></ImageBackground>
          )}
          {type == 'audio' && (
            <ImageBackground
              style={{height: 30, width: 30}}
              resizeMode="contain"
              source={ImageCostants.NUZZLEUP.PLAY_RECORD}></ImageBackground>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  emptyView() {
    return (
      <TouchableOpacity
        style={{
          height: Constants.DIMESIONS.WIDOWHEIGHT,
          flex: 1,
          marginTop: heightToDp(30),
          alignItems: 'center',
        }}>
        <Text
          style={{color: Constants.COLORS.buttonColor2, alignSelf: 'center'}}>
          No messages yet!
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
  renderSurveyPopUp() {
    return (
      <>
        <RBSheet
          ref={(ref) => {
            this.refRBSheet = ref;
          }}
          // closeOnPressMask={closeOnPressMask}
          animationType={'slide'}
          height={500}
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
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: Constants.COLORS.dividerDark,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {'Survey'}
              </Text>
            </View>
            <Questions
              userId={this.state.userId}
              onComplete={() => this.onSurveyComplete()}></Questions>
          </View>
        </RBSheet>
      </>
    );
  }

  render() {
    const {messageArray, isVisibleCongratulation, userId} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Constants.COLORS.whiteColor,
        }}>
        <Statusbar />
        {this.renderHeader()}
        <LoaderComponent isLoading={this.state.isLoading} />
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
              textAlign: 'center',
              fontFamily: Constants.FONTFAMILY.BOLD,
              lineHeight: 35,
            }}>
            {'Chat'}
          </Text>
        </View>

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={messageArray}
          ListEmptyComponent={() => this.emptyView()}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          renderItem={(item) => this.renderRow(item)}></FlatList>
        <SCLAlertView
          onyesPress={() =>
            this.setState({surveyQuestionrate: false}, () => {
              this.refRBSheet.open();
              this.disableSurveyService();
            })
          }
          willHaveTwoControl={true}
          title={`Let's start Survey`}
          subtitle={Constants.STRING.WOULD_LIKE}
          onRequestClose={() => [
            this.disableSurveyService(),
            this.setState({surveyQuestionrate: false}),
          ]}
          yesButtonHeading="Get More Nuzzles"
          noButtonHeading="Not Now"
          willShow={this.state.surveyQuestionrate}
        />
        <InformAlertView
          textHeadingOne={Constants.STRING.CONGRATES_SURVEY1}
          textHeadingTwo={Constants.STRING.YOU_EARNED}
          points={'+40'}
          nuzzlesText={Constants.STRING.NUZZLE_WITH_HUE}
          earningPoints={40}
          willButtonVisible={false}
          textHeadingThirdVisible={false}
          onRequestClose={() => this.setState({isVisibleCongratulation: false})}
          onBackdropPress={() =>
            this.setState({isVisibleCongratulation: false})
          }
          isVisible={
            isVisibleCongratulation && this.state.isLoggedIn
          }></InformAlertView>
        {this.renderSurveyPopUp()}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
});

//redux function for edit profile and get profile
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
