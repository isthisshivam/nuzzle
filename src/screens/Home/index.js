import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  Alert,
  Button,
  FlatList,
  StatusBar,
  ImageBackground,
  // Modal,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
//import all the components we are going to use.
import Carousel, {Pagination} from 'react-native-snap-carousel';
//import Carousel from 'react-native-carousel-view';
import PagerView from 'react-native-pager-view';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {
  heightToDp,
  StatusbarA,
  isSignedIn,
  width,
  height,
  Statusbar,
} from '../../frequent/Utility/Utils';
import commonUtility from '../../../src/frequent/Utility/CommonUtility';
import {bindActionCreators} from 'redux';
import * as HomeAction from '../../redux/actions/HomeAction';
import * as LikeDislikeAction from '../../redux/actions/LikeDislikeAction';
import {connect} from 'react-redux';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import Skeletons from '../../frequent/Skeletons';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 94 : 55;
import CarasoulView from '../../components/Carasoul';
import SCLAlertView from '../../components/SCLAlertView';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import BottomSheetView from '../../components/BottomSheetView';
import LoaderComponent from '../../components/LoaderComponent';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification'; // for android
import PushNotificationIOS from '@react-native-community/push-notification-ios'; // for ios
import InformAlertView from '../../components/InformAlertView';
import {triggerPushNotification} from '../../components/PushNotification';

// import RNIap, {
//   Product,
//   ProductPurchase,
//   PurchaseError,
//   acknowledgePurchaseAndroid,
//   purchaseErrorListener,
//   purchaseUpdatedListener,
// } from 'react-native-iap';

// const itemSkus = Platform.select({
//   ios: ['com.example.productId'],
//   android: ['com.nuzzle.dev.com'],
// });
// const itemSubs = Platform.select({
//   ios: ['test.sub'],
//   android: ['test.sub'],
// });
let purchaseUpdateSubscription;
let purchaseErrorSubscription;
// const itemSubs = Platform.select({ios: ['test.sub'], android: ['test.sub']});
//////////////////////////
var action = '';
const FUDATA = 11;
global.isLoggedIn = false; /// hold value to the current context variable to check user logged in or not
var FREE_MATCH_COUNT = 2;
//////////////////////////
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      usersData: [],
      activeSlide: 0,
      offset: 1,
      totalPage: 1,
      show: false,
      isLoggedIn: false,
      data: true,
      isProfileCompleted: false,
      avatarSource: '',
      willShowGenderRBSheet: false,
      willShowRadiusRBSheet: false,
      isUserPerformingHisAction: false,
      productList: [],
      receipt: '',
      availableItemsMessage: '',
      isVisible: false,
      userNameForMatchReq: null,
      whenYouMarkedAUserHeadToToeVisible: false,
      whenOtherUserHeadToToeYou: false,
      isCross: false,
      isLoading: false,
      another_user_fcm_tkn: null,
      // iap variables
      productList: [],
      receipt: '',
      availableItemsMessage: '',
    };
    this.shakeAnimation = new Animated.Value(0);
    this.shakeAnimationForDisLike = new Animated.Value(0);
    this.haveUserWrittenGenderAndAgeSignature(); ///check whether user filled out basic startup info
    // this.saveToken = this.saveToken.bind(this);
  }

  componentWillUnmount() {
    //react native in app purchase
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  }
  componentDidMount = async () => {
    await this.props.navigation.addListener('focus', () => {
      isSignedIn(
        this.props.userLoginData ||
          this.props.userVerifyData ||
          this.props.userRegisterData,
      ).then((res) => {
        if (res) {
          this.setState({isLoggedIn: true}, () => {
            this.getUserToDate();
          });
        } else {
          this.setState({isLoggedIn: false}, () => {
            this.getUserToDate();
          });
        }
        this.checkHaveFreeMatchRequest();
      });
    });
    triggerPushNotification(this.handleNotification);
    return;
    //react native in app purchase
    try {
      const result = await RNIap.initConnection();
      console.log('connection is => ', result);
      await RNIap.consumeAllItemsAndroid();
    } catch (err) {
      console.log('error in cdm => ', err);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        if (
          purchase.purchaseStateAndroid === 1 &&
          !purchase.isAcknowledgedAndroid
        ) {
          try {
            const ackResult = await acknowledgePurchaseAndroid(
              purchase.purchaseToken,
            );
            console.log('ackResult', ackResult);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
        this.purchaseConfirmed();
        this.setState({receipt: purchase.transactionReceipt});
        purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.log('purchaseErrorListener', error);
            // alert('purchase error', JSON.stringify(error));
          },
        );
      },
    );
  };

  // //react native in app purchase
  // purchaseConfirmed = () => {
  //   //you can write code here for what changes you want to do in db on purchase successfull
  // };
  // //react native in app purchase
  // getItems = async () => {
  //   try {
  //     console.log('itemSkus[0]', itemSkus[0]);
  //     const products = await RNIap.getProducts(itemSkus);
  //     console.log('Products[0]', products[0]);
  //     this.setState({productList: products});
  //     this.requestPurchase(itemSkus[0]);
  //   } catch (err) {
  //     console.log('getItems || purchase error => ', err);
  //   }
  // };
  // //react native in app purchase
  // getAvailablePurchases = async () => {
  //   try {
  //     const purchases = await RNIap.getAvailablePurchases();
  //     console.info('Available purchases => ', purchases);
  //     if (purchases && purchases.length > 0) {
  //       this.setState({
  //         availableItemsMessage: `Got ${purchases.length} items.`,
  //         receipt: purchases[0].transactionReceipt,
  //       });
  //     }
  //   } catch (err) {
  //     console.warn(err.code, err.message);
  //     console.log('getAvailablePurchases error => ', err);
  //   }
  // };
  // //react native in app purchase
  // requestPurchase = async (sku) => {
  //   try {
  //     await RNIap.requestPurchase(sku, false);
  //   } catch (err) {
  //     console.warn(err.code, err.message);
  //   }
  // };
  // //react native in app purchase
  // requestSubscription = async (sku) => {
  //   try {
  //     await this.getItems();
  //     await RNIap.requestSubscription(sku);
  //   } catch (err) {
  //     alert(err.toLocaleString());
  //   }
  // };

  handleNotification = (notification, way) => {
    const {data} = notification;
    console.log('handleNotification====', data);
    if (data.action == 'Chat') {
      if (way == 1) {
        this.props.navigation.navigate(Constants.ROUTENAME.CHATTING, {
          id: data.anotherUserId,
          name: data.anotherUserName,
          profile_pic: data.anotherUserProfile,
          route: 'CHAT',
        });
      }
    } else if (data.action == 'match') {
      if (way == 1) {
        this.props.navigation.navigate('NuzzleUp');
      }
    }
  };
  checkHaveFreeMatchRequest = async () => {
    var today = new Date(); // get today date
    var dateValue =
      today.getDate() +
      '/' +
      parseInt(today.getMonth() + 1) +
      '/' +
      today.getFullYear();

    //Get stored date
    let [date] = await Promise.all([
      commonUtility.getStoreData(Constants.STRING.GET_DATE),
    ]);
    console.log('today date is =>', dateValue, date);

    if (date == null || date != dateValue) {
      //set latest date
      await commonUtility.setStoreData(
        Constants.STRING.GET_DATE,
        JSON.stringify(dateValue),
      );
      await commonUtility.setStoreData(
        Constants.STRING.FREE_MATCH_COUNT,
        JSON.stringify(FREE_MATCH_COUNT),
      );
    } else {
    }
  };

  checkUserAbleToSendFreeMatchRequest = async () => {
    const {activeSlide, usersData} = this.state;
    //Get free matches count
    let [matchesCount] = await Promise.all([
      commonUtility.getStoreData(Constants.STRING.FREE_MATCH_COUNT),
    ]);
    if (matchesCount != 0) {
      matchesCount--;
      await commonUtility.setStoreData(
        Constants.STRING.FREE_MATCH_COUNT,
        JSON.stringify(matchesCount),
      );
      this.onLikeDislikePress(1);
    } else {
      // alert(
      //   'check nuzzles if user have remains nuZZle then hit hit request else show dont have nuzzle ',
      // );  const {usersData, activeSlide} = this.state;

      this.setState({
        isVisible: true,
        userNameForMatchReq: usersData[activeSlide].name,
      });
    }
  };

  haveUserWrittenGenderAndAgeSignature = async () => {
    let [gender, radius] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.GENDER),
      await commonUtility.getStoreData(Constants.STRING.RADIUS),
    ]);
    //// if user already
    ///fill out the signature that' all he don't need to fill again and again
    if (gender && radius) {
      global.isLoggedIn = true;
      this.setState({
        show: false,
      });
    } else {
      global.isLoggedIn = false;
      this.setState({
        show: true,
      });
    }
  };

  onRegistered = (deviceToken) => {
    commonUtility.displayToast(deviceToken);
    return;
    Alert.alert('Registered For Remote Push', `Device Token: ${deviceToken}`, [
      {
        text: 'Dismiss',
        onPress: null,
      },
    ]);
  };

  onRegistrationError = (error) => {
    commonUtility.displayToast(`Error (${error.code}): ${error.message}`);
    return;
    Alert.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    );
  };

  onRemoteNotification = (notification) => {
    //alert(notification);
    return;
    const isClicked = notification.getData().userInteraction === 1;

    const result = `
      Title:  ${notification.getTitle()};\n
      Subtitle:  ${notification.getSubtitle()};\n
      Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()};\n
      Notification is clicked: ${String(isClicked)}.`;

    if (notification.getTitle() == undefined) {
      Alert.alert('Silent push notification Received', result, [
        {
          text: 'Send local push',
          onPress: sendLocalNotification,
        },
      ]);
    } else {
      Alert.alert('Push Notification Received', result, [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ]);
    }
  };

  creatChannel = async () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'NUZZLE_PUSH_ID', // (required)
          channelName: 'NUZZLE', // (required)
        },
        (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }
  };

  registerNotificationEventManager = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function async(data) {
        const {token} = data;
        console.log('TOKEN:ONSPLASH:::::', token);
        // firebaseToken = token;
        alert(token);
        // if (Platform.OS == 'ios') {
        //   //convertApnsToken(token);
        // } else {
        //   //  this.saveToken;
        // }
      },
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // process the notification
        console.log('onNotification NOTIFICATION:', notification);
        console.log(
          'onNotification userInteraction:',
          notification.userInteraction,
        );
        if (notification?.userInteraction) {
          //handleNotification(notification);
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log(' onAction ACTION:', notification.action);
        console.log(' onAction NOTIFICATION:', notification);
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        //if (Platform.OS == 'ios') convertApnsToken(firebaseToken);
        console.log('onRegistrationError', err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
  saveToken() {
    alert('savetoken');
  }
  // saveToken = (token) => {
  //   alert(token);
  //   await commonUtility.setStoreData('FCM_TOKEN', tkn).then(() => {
  //     //navigateToHome();
  //   });
  // };

  ////get User To Date request begin////
  getUserToDate() {
    var idForSend;
    const {isLoggedIn} = this.state;
    if (
      this.props.userLoginData ||
      this.props.userVerifyData ||
      this.props.userRegisterData
    ) {
      const {id} =
        this.props.userLoginData ||
        this.props.userVerifyData ||
        this.props.userRegisterData;
      idForSend = id;
    }

    //////////if user has loggedIn then send  (id ) parameter
    this.setState({isLoading: true});
    if (isLoggedIn) {
      const formData = new FormData();
      formData.append(ApiConstants.UID, idForSend);
      formData.append(ApiConstants.CURRENT_PAGE, this.state.offset);
      this.props.actions.GetUserHomeTo.getUserRequest(
        formData,
        this._onSuccess,
        this._onFailure,
      );
    } else {
      const formData = new FormData();
      formData.append(ApiConstants.CURRENT_PAGE, FUDATA);
      this.props.actions.GetUserHomeTo.getUserRequest(
        formData,
        this._onSuccess,
        this._onFailure,
      );
    }
  }

  _onSuccess = async (responsedata) => {
    console.log('responsedata.getUsersToData==', JSON.stringify(responsedata));
    if (responsedata.status == ApiConstants.SUCCESS) {
      let usersData = responsedata.data.items;
      let totalPage = responsedata.data.total_pages;
      let profile_completed = responsedata.data.profile_completed;
      if (usersData.length == 0) {
        this.setState({isUserPerformingHisAction: true});
      }

      //inflate only one time not again and again
      //TODO: uncomment this section
      // if (this.state.offset == 1) {
      //   if (profile_completed == Constants.STRING.ZERO) {
      //     this.setState({isProfileCompleted: true});
      //   } else {
      //     this.setState({isProfileCompleted: false});
      //   }
      // }

      console.log('totalPage', totalPage);
      this.setState({
        totalPage: totalPage == '0' ? 1 : totalPage,
        usersData:
          this.state.offset == 1
            ? usersData
            : [...this.state.usersData, ...usersData],
      });
      let dataArray = this.state.usersData.concat(usersData);
      // this.setState({
      //   totalPage: totalPage,
      //   usersData: this.state.offset == 1 ? usersData : dataArray,
      // });
      this.setState({isLoading: false});
    } else {
      this.setState({isLoading: false}, () => {
        commonUtility.displayToast(ApiConstants.failed);
      });
    }
  };

  _onFailure = async (error) => {
    console.log('error.getUsersToData==', error);
    const {message} = error;
    commonUtility.displayToast(message);
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

  startShakeForDisLike = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimationForDisLike, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimationForDisLike, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimationForDisLike, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimationForDisLike, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  ////like dislike request begins////
  onLikeDislikePress = async (Action) => {
    // if (Action == 1) {
    //   this.carouselRef.snapToNext(true, false);
    //   //this.setState({activeSlide: this.state.activeSlide + 1});
    // } else {
    //   this.carouselRef.snapToPrev(true, false);
    //   //this.setState({activeSlide: this.state.activeSlide - 1});
    // }

    const {activeSlide, usersData} = this.state;
    //alert(activeSlide);
    this.carouselRef.snapToItem(activeSlide, true);
    const {id} =
      this.props.userLoginData ||
      this.props.userVerifyData ||
      this.props.userRegisterData;

    var anotherId = usersData[activeSlide].id;
    var already_like_status = usersData[activeSlide].like;
    console.log('snapToItem==', usersData[activeSlide]);
    this.setState({another_user_fcm_tkn: usersData[activeSlide].device_token});
    ///request
    const formData = new FormData();
    formData.append(ApiConstants.ANOTHER_UID, anotherId);
    formData.append(ApiConstants.LIKE, Action);
    formData.append(ApiConstants.UID, id);
    formData.append(ApiConstants.ALREADY_LIKED, already_like_status);
    this.props.actions.LikeDislikeActionTo.likeDislikeRequest(
      formData,
      this._onSuccessLikeDislike,
      this._onFailureLikeDislike,
    );
  };

  _onSuccessLikeDislike = async (responsedata) => {
    const {activeSlide, usersData} = this.state;
    var userMatchStatus = usersData[activeSlide].like;
    var id = usersData[activeSlide].id;
    var name = usersData[activeSlide].name;
    var profile_pic = usersData[activeSlide].profile_pic;
    var userDetailsObject = {
      id: id,
      name: name,
      profile_pic: profile_pic[0],
      userMatchStatus: userMatchStatus,
      another_user_fcm_tkn: this.setState.another_user_fcm_tkn,
    };

    //  just for checking i  am writing this code of bundle
    // this.props.navigation.navigate(
    //   Constants.ROUTENAME.MATCH,
    //   userDetailsObject,
    // );
    // return;

    // working code properly
    if (userMatchStatus == ApiConstants.LIKED) {
      setTimeout(() => {
        this.popUserFromList(id);
        this.props.navigation.navigate(
          Constants.ROUTENAME.MATCH,
          userDetailsObject,
        );
      }, 100);
    } else {
      setTimeout(() => {
        //commonUtility.displayToast('Success');
        this.popUserFromList(id);
      }, 100);
    }
  };

  _onFailureLikeDislike = async (error) => {
    console.log('_onFailureLikeDislike=>', error);
    setTimeout(() => {
      commonUtility.displayToast('Something going wrong.');
    }, 100);
    //alert(JSON.stringify(error));
  };

  ///delete user on like and dislike from list
  popUserFromList = (id) => {
    ///deleting user from array with the help of id
    const filteredData = this.state.usersData.filter((item) => item.id !== id);
    this.setState({usersData: filteredData}, () => {
      // if (this.state.usersData.length > 0) {
      //   this.carouselRef.snapToNext(true, true)
      // }
    });
  };

  ////like dislike request end////
  handleOpen = () => {
    this.setState({show: true});
  };

  handleCloseAlert = () => {
    this.setState({show: false});
    setTimeout(() => {
      this.setState({willShowGenderRBSheet: true});
    }, 800);
  };

  handleGender = async (dataFromProps) => {
    await commonUtility.setStoreData(
      Constants.STRING.GENDER,
      JSON.stringify(dataFromProps),
    );
    this.setState({willShowGenderRBSheet: false});
    setTimeout(() => {
      this.setState({willShowRadiusRBSheet: true});
    }, 800);
  };

  handleRadius = async (dataFromProps) => {
    await commonUtility.setStoreData(
      Constants.STRING.RADIUS,
      JSON.stringify(dataFromProps),
    );
    this.setState({willShowRadiusRBSheet: false}, () => {
      this.haveUserWrittenGenderAndAgeSignature();
    });
  };

  completeProfile() {
    // ApiConstants;
    this.setState({isProfileCompleted: false});
    this.props.navigation.navigate(Constants.ROUTENAME.EDITPROFILE, {
      CAMERA_WILL_OPEN: true,
    });
  }

  loadMoreUser = () => {
    const {totalPage, offset} = this.state;
    // console.log(
    //   'loadMoreUser',
    //   this.state.offset + '--------',
    //   this.state.totalPage,
    // );
    // this.setState(
    //   {
    //     offset: this.state.offset + 1,
    //   },
    //   () => {
    //     if (offset != totalPage) {
    //       this.getUserToDate();
    //     } else {
    //       // this.getUserToDate();
    //     }
    //   },
    // );
    if (offset != totalPage) {
      this.setState(
        {
          offset: this.state.offset + 1,
        },
        () => {
          this.getUserToDate();
        },
      );
    } else {
    }
  };

  onBackdropPress() {
    this.setState({
      isVisible: false,
      whenYouMarkedAUserHeadToToeVisible: false,
      whenOtherUserHeadToToeYou: false,
    });
  }
  onRequestClose() {
    this.setState({isVisible: false});
  }
  onAccepted() {
    const {usersData, activeSlide} = this.state;
    this.setState({isVisible: false});
    //  alert(JSON.stringify(usersData[activeSlide].name));
  }
  renderHeader() {
    return (
      <View
        style={{
          height: APPBAR_HEIGHT,
          flexDirection: Constants.STRING.ROW,
          //marginTop: Platform.OS === 'android' ? heightToDp(5) : 0,
          backgroundColor: '#f61796d9',
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
            source={ImageCostants.NUZZLEUP.FILTER}
          />
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

  renderCarasoul() {
    const {userName, usersData, isProfileCompleted} = this.state;

    return (
      <>
        {/* <Text style={{alignSelf: 'center'}}>IN DEVELOPMENT TESTING</Text> */}
        <Carousel
          ref={(c) => {
            this.carouselRef = c;
          }}
          onEndReached={() => this.loadMoreUser()}
          // onEndReachedThreshold={0.6}
          layout={'default'}
          //layoutCardOffset={`9`}
          data={usersData}
          //carouselRef={this.carouselRef}
          //autoplay={true}
          //autoplayInterval={2000}
          useExperimentalSnap={true}
          renderItem={(item) => (
            <CarasoulView
              uploadImageControlWillVisible={false}
              willShowProfile={false}
              index={item.index}
              willImageClick={true}
              isProfileCompleted={isProfileCompleted}
              isLoggedIn={this.state.isLoggedIn}
              navigation={this.props.navigation}
              item={item.item}
            />
          )}
          snapToInterval={0}
          pagingEnabled={Platform.OS === 'android' ? true : false}
          //activeSlideAlignment="center"
          // inactiveSlideShift={0}
          //inactiveSlideScale={1}
          //inactiveSlideOpacity={1}
          //disableIntervalMomentum={true}
          // activeAnimationType="timing"
          sliderWidth={Constants.DIMESIONS.WINDOWWIDTH}
          //itemWidth={Constants.DIMESIONS.WINDOWWIDTH / 1.3}
          itemWidth={Constants.DIMESIONS.WINDOWWIDTH}
          onSnapToItem={(index) => [
            this.setState({activeSlide: index}),
            // alert(index),
          ]}
          onBeforeSnapToItem={(index) => {
            this.setState({activeSlide: index});
          }}
          ListEmptyComponent={() => this.ListEmptyComponent()}
        />
      </>
    );
  }
  ListEmptyComponent() {
    return (
      <View
        style={{
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
          height: height / 1.5,
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            fontSize: 15,
            fontFamily: 'gibson-bold',
            color: 'white',
          }}>
          No Users
        </Text>
      </View>
    );
  }
  renderUserControllItem() {
    const {activeSlide, usersData, isLoggedIn} = this.state;
    return (
      <>
        <View
          style={{
            position: 'absolute',
            // marginBottom:
            //   Constants.DIMESIONS.WIDOWHEIGHT > 800
            //     ? heightToDp(15)
            //     : heightToDp(20),
            width: '100%',
            marginTop: height / 1.35,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Constants.COLORS.transparent,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: Constants.COLORS.transparent,
              marginTop: heightToDp(5),
            }}>
            <Animated.View
              style={{transform: [{translateX: this.shakeAnimation}]}}>
              <TouchableOpacity
                onPress={() =>
                  isLoggedIn
                    ? [
                        (action = 'DISLIKE'),
                        this.onLikeDislikePress(2),
                        this.startShakeForLike(),
                        this.setState({isCross: true}),
                      ]
                    : this.props.navigation.navigate(Constants.ROUTENAME.SPLASH)
                }
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 70,
                  marginRight: 20,
                  width: 70,
                }}>
                <ImageBackground
                  source={ImageCostants.SPLASH.CROSS}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 70,
                    width: 70,
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                transform: [{translateX: this.shakeAnimationForDisLike}],
              }}>
              <TouchableOpacity
                onPress={() =>
                  isLoggedIn
                    ? [
                        (action = 'LIKE'),
                        this.checkUserAbleToSendFreeMatchRequest(),
                        this.startShakeForDisLike(),
                      ]
                    : this.props.navigation.navigate(Constants.ROUTENAME.SPLASH)
                }
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 70,
                  marginLeft: 20,
                  width: 70,
                }}>
                <ImageBackground
                  source={ImageCostants.SPLASH.HEART}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 70,
                    width: 70,
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </>
    );
    // if (isLoggedIn)
    //   return (
    //     <>
    //       <View
    //         style={{
    //           position: 'absolute',
    //           // marginBottom:
    //           //   Constants.DIMESIONS.WIDOWHEIGHT > 800
    //           //     ? heightToDp(15)
    //           //     : heightToDp(20),
    //           width: '100%',
    //           marginTop: height / 1.35,
    //           alignContent: 'center',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           backgroundColor: Constants.COLORS.transparent,
    //         }}>
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             justifyContent: 'center',
    //             backgroundColor: Constants.COLORS.transparent,
    //             marginTop: heightToDp(5),
    //           }}>
    //           <Animated.View
    //             style={{transform: [{translateX: this.shakeAnimation}]}}>
    //             <TouchableOpacity
    //               onPress={() =>
    //                 isLoggedIn
    //                   ? [
    //                       (action = 'DISLIKE'),
    //                       this.onLikeDislikePress(2),
    //                       this.startShakeForLike(),
    //                     ]
    //                   : this.props.navigation.navigate(
    //                       Constants.ROUTENAME.SPLASH,
    //                     )
    //               }
    //               style={{
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 height: 70,
    //                 marginRight: 20,
    //                 width: 70,
    //               }}>
    //               <ImageBackground
    //                 source={ImageCostants.SPLASH.CROSS}
    //                 style={{
    //                   justifyContent: 'center',
    //                   alignItems: 'center',
    //                   height: 70,
    //                   width: 70,
    //                 }}
    //               />
    //             </TouchableOpacity>
    //           </Animated.View>
    //           <Animated.View
    //             style={{
    //               transform: [{translateX: this.shakeAnimationForDisLike}],
    //             }}>
    //             <TouchableOpacity
    //               onPress={() =>
    //                 isLoggedIn
    //                   ? [
    //                       (action = 'LIKE'),
    //                       this.checkUserAbleToSendFreeMatchRequest(),
    //                       this.startShakeForDisLike(),
    //                     ]
    //                   : this.props.navigation.navigate(
    //                       Constants.ROUTENAME.SPLASH,
    //                     )
    //               }
    //               style={{
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 height: 70,
    //                 marginLeft: 20,
    //                 width: 70,
    //               }}>
    //               <ImageBackground
    //                 source={ImageCostants.SPLASH.HEART}
    //                 style={{
    //                   justifyContent: 'center',
    //                   alignItems: 'center',
    //                   height: 70,
    //                   width: 70,
    //                 }}
    //               />
    //             </TouchableOpacity>
    //           </Animated.View>
    //         </View>
    //       </View>
    //     </>
    //   );
  }

  Skeletons(type) {
    return (
      <>
        <View
          style={{
            marginTop:
              Constants.DIMESIONS.WIDOWHEIGHT > 800 && Platform.OS === 'ios'
                ? heightToDp(3)
                : heightToDp(8),
          }}>
          <Skeletons type={type} />
        </View>
      </>
    );
  }
  noUsersToGoAhead = () => {
    return (
      <View style={{flex: 1, backgroundColor: 'yellow'}}>
        <Text>No users</Text>
      </View>
    );
  };
  _renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  render() {
    const {
      userName,
      usersData,
      isLoggedIn,
      show,
      willShowGenderRBSheet,
      isProfileCompleted,
      isUserPerformingHisAction,
      willShowRadiusRBSheet,
      isVisible,
      userNameForMatchReq,
      whenYouMarkedAUserHeadToToeVisible,
      whenOtherUserHeadToToeYou,
      isCross,
      isLoading,
    } = this.state;
    const {showLoaderLikeDislike} = this.props;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ImageBackground
          style={{
            flex: 1,
          }}
          source={ImageCostants.SPLASH.PATHBACKGROUND}>
          <Statusbar />
          {/* <StatusbarA /> */}
          <LoaderComponent isLoading={this.props.showLoaderLikeDislike} />
          <InformAlertView
            textHeadingOne={Constants.STRING.MATCH_REQUESTED}
            textHeadingTwo={Constants.STRING.WILL_COST}
            name={' ' + userNameForMatchReq + '.'}
            points={'-12'}
            nuzzlesText={Constants.STRING.NUZZLE_WITH_DOT}
            earningPoints={15}
            willButtonVisible={true}
            textHeadingThirdVisible={true}
            onAccepted={() => this.onAccepted()}
            onRequestClose={() => this.onRequestClose()}
            onBackdropPress={() => this.onBackdropPress()}
            isVisible={isVisible}
          />
          <InformAlertView
            textHeadingOne={Constants.STRING.CONGRATES_HEAD_TO_TOE}
            textHeadingTwo={Constants.STRING.YOU_EARNED}
            //name={' Kira' + '.'}
            //points={'+40'}
            nuzzlesText={Constants.STRING.NUZZLE_WITH_QUES}
            earningPoints={10}
            willButtonVisible={false}
            textHeadingThirdVisible={false}
            onRequestClose={() => this.onRequestClose()}
            onBackdropPress={() => this.onBackdropPress()}
            isVisible={whenYouMarkedAUserHeadToToeVisible}
          />

          <InformAlertView
            textHeadingOne={Constants.STRING.CONGRATES_HEAD_TO_TOE_SECOND}
            textHeadingTwo={Constants.STRING.YOU_EARNED}
            //name={' Kira' + '.'}
            //points={'+40'}
            nuzzlesText={Constants.STRING.NUZZLE_WITH_HUE}
            earningPoints={10}
            willButtonVisible={false}
            textHeadingThirdVisible={false}
            onRequestClose={() => this.onRequestClose()}
            onBackdropPress={() => this.onBackdropPress()}
            isVisible={whenOtherUserHeadToToeYou}
          />
          <LoaderComponent isLoading={this.props.showLoaderLikeDislike} />
          {this.renderHeader()}

          <BottomSheetView
            closeOnPressBack={false}
            closeOnPressMask={false}
            heading={Constants.STRING.I_AM_SEEKING}
            data={['Male', 'Female']}
            handlePress={this.handleGender}
            height={220}
            willShow={willShowGenderRBSheet}
          />

          <BottomSheetView
            closeOnPressBack={false}
            closeOnPressMask={false}
            heading={Constants.STRING.PREFER_RADIUS}
            data={['10 miles', '20 miles', '50 miles']}
            handlePress={this.handleRadius}
            height={250}
            willShow={willShowRadiusRBSheet}
          />

          {show && (
            <>
              <SCLAlertView
                willHaveTwoControl={false}
                title={Constants.STRING.WELCOME}
                subtitle={Constants.STRING.WLECOME_SUBTITLE}
                onRequestClose={() => this.handleCloseAlert()}
                willShow={show}
              />
            </>
          )}
          {isProfileCompleted && isLoggedIn ? (
            <>
              <SCLAlertView
                willHaveTwoControl={false}
                title={Constants.STRING.GREAT}
                subtitle={Constants.STRING.UPDATE_PROFILE}
                onRequestClose={() => this.completeProfile()}
                willShow={isProfileCompleted}
              />
            </>
          ) : null}
          {this.state.offset != this.state.totalPage ? (
            usersData.length > 0 ? (
              <>
                {/* {usersData.length > 0
                ? this.renderCarasoul()
                : this.Skeletons(Constants.STRING.CARD)}
              {usersData.length > 0
                ? this.renderUserControllItem()
                : this.Skeletons(Constants.STRING.PARAGRAPH)} */}
                {this.renderCarasoul()}
                {this.renderUserControllItem()}
              </>
            ) : (
              <>
                {this.Skeletons(Constants.STRING.CARD)}
                {this.Skeletons(Constants.STRING.PARAGRAPH)}
              </>
            )
          ) : (
            <>{this.ListEmptyComponent()}</>
          )}

          {/* {isLoading ? (
            <>
              {this.Skeletons(Constants.STRING.CARD)}
              {this.Skeletons(Constants.STRING.PARAGRAPH)}
            </>
          ) : (
            <>
              {this.renderCarasoul()}
              {usersData.length > 0 && this.renderUserControllItem()}
            </>
          )} */}
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  showLoader: state.homeReducer.showLoader,
  userLoginData: state.loginReducer.userData,
  userVerifyData: state.verificationReducer.userData,
  showLoaderLikeDislike: state.likeDislikeReducer.showLoaderLikeDislike,
  userRegisterData: state.registerReducer.userData,
});

//redux function for home
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      GetUserHomeTo: bindActionCreators(HomeAction, dispatch),
      LikeDislikeActionTo: bindActionCreators(LikeDislikeAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
//todo:addapi
