/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  Platform,
  StatusBar,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  heightToDp,
  StatusbarA,
  isSignedIn,
  width,
  height,
  Statusbar,
} from './src/frequent/Utility/Utils';
import Constants from './src/frequent/Constants';
import ImageCostants from './src/frequent/ImageConstants';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Splash from './src/screens/Splash';
import Requests from './src/screens/Requests';
import WelcomeSplash from './src/screens/WelcomeSplash';
import Home from './src/screens/Home';
import Match from './src/screens/Match';
import EditProfile from './src/screens/EditProfile';
import Setting from './src/screens/Setting';
import Profile from './src/screens/Profile';
import Filter from './src/screens/Filter';
import UserAggrement from './src/screens/UserAggrement';
import NuzzleUp from './src/screens/NuzzleUp';
import NearMe from './src/screens/NearMe';
import Chatting from './src/screens/Chatting';
import Chat from './src/screens/Chat';
import Login from './src/screens/Signature/Login';
import Register from './src/screens/Signature/Register';
import ForgotPassword from './src/screens/Signature/ForgotPassword';
import Verification from './src/screens/Signature/Verification';
import ImageConstants from './src/frequent/ImageConstants';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const TabBar = createBottomTabNavigator();
const NuzzelRoot = createStackNavigator();
const HomeRoot = createStackNavigator();
const NearMeRoot = createStackNavigator();
const ChatRoot = createStackNavigator();
console.disableYellowBox = true;
import Geolocation from '@react-native-community/geolocation';
import commonUtility from './src/frequent/Utility/CommonUtility';
import Geocoder from 'react-native-geocoder';
import Secrets from './src/frequent/Secrets';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
//import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
const tabBarOptions = {
  activeTintColor: Constants.COLORS.buttonColor4,
  labelStyle: {fontSize: 9, fontFamily: Constants.FONTFAMILY.REGULAR},
  style: {
    height:
      Constants.DIMESIONS.WIDOWHEIGHT > 800 && Platform.OS === 'ios' ? 100 : 80,
    backgroundColor: Constants.COLORS.buttonColor2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  tabStyle: {
    padding: 0,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  keyboardHidesTabBar: true,
  adaptive: false,
};
///////////////////
console.disableYellowBox = true;
var fcmToken = null;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    ///init firebase
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: Secrets.FIREBASE_KEY.API_KEY,
        authDomain: Secrets.FIREBASE_KEY.AUTH_DOMAIN,
        databaseURL: Secrets.FIREBASE_KEY.DB_URL,
        projectId: Secrets.FIREBASE_KEY.PROJECT_ID,
        storageBucket: Secrets.FIREBASE_KEY.STORAGE_BUCKET,
        messagingSenderId: Secrets.FIREBASE_KEY.SENDER_ID,
        appId: Secrets.FIREBASE_KEY.APP_ID,
        measurementId: Secrets.FIREBASE_KEY.M_M_ID,
      };
      firebase.initalizing(firebaseConfig);
    }
    ///init map api key ////
    Geocoder.fallbackToGoogle(Secrets.MAPS_API_KEY.API_KEY);
  }

  componentDidMount = async () => {
    this.signInAnonymously();
    this.requestLocationPermission();
    this.requestNotificationPermission();
  };
  signInAnonymously = async () => {
    try {
      await auth().signInAnonymously();
    } catch (e) {
      console.error(e);
    }
  };
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          this.getOneTimeLocation();
        } else {
          commonUtility.displayToast('Permission denied.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        console.log('getOneTimeLocation currentLongitude ', currentLongitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        console.log('getOneTimeLocation currentLatitude ', currentLongitude);
        this.getLocationNameThroughLatLng(currentLatitude, currentLongitude);
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  getLocationNameThroughLatLng = async (currentLatitude, currentLongitude) => {
    let res = await Geocoder.geocodePosition({
      lat: parseFloat(currentLatitude),
      lng: parseFloat(currentLongitude),
    });
    var currentLocation = res[0].locality; /// got the city name
    var postalCode = res[0].postalCode; //got the postalCode
    var subAdminArea = res[0].subAdminArea; //got the sub city name
    var countryCode = res[0].countryCode;
    var location = {
      postalCode: postalCode,
      city: subAdminArea,
      currentLatitude: currentLatitude,
      currentLongitude: currentLongitude,
      locationName: currentLocation,
      countryCode: countryCode,
    };
    console.log('getLocationNameThroughLatLng=>', postalCode);
    await commonUtility.setStoreData(
      Constants.STRING.LOCATION_DATA,
      JSON.stringify(location),
    );
  };

  requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status if :', authStatus);
      this.getFcmToken(); //<---- Add this
    } else {
      console.log('Authorization status else:', authStatus);
    }
  };

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Firebase Token.getFcmToken:', fcmToken);
      //set fcm token to local storage.
      commonUtility.setStoreData(
        Constants.STRING.FCM_TOKEN,
        JSON.stringify(fcmToken),
      );
    } else {
      console.log('Failed.getFcmToken', 'No token received');
    }
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            {/* <StatusbarA /> */}
            {/* <Statusbar /> */}
            <Root />
            {/* <Text>My App will run </Text> */}
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}

function Root() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName={'WelcomeSplash'}>
      <Stack.Screen name="WelcomeSplash" component={WelcomeSplash} />
      <Stack.Screen name="Home" component={tabBarModule} />
      <Stack.Screen name="Splash" component={Splash} />

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="Chatting" component={Chatting} />
      <Stack.Screen name="NearMe" component={NearMe} />
      <Stack.Screen name="NuzzleUp" component={NuzzleUp} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Match" component={Match} />
      <Stack.Screen name="Requests" component={Requests}></Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="UserAggrement" component={UserAggrement} />
    </Stack.Navigator>
  );
}

function tabBarModule() {
  return (
    <TabBar.Navigator headerMode="none" tabBarOptions={tabBarOptions}>
      <TabBar.Screen
        name={'Home'}
        component={HomeStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color, size}) => (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 50 / 2,
                backgroundColor: Constants.COLORS.buttonColor2,
                borderColor: 'gray',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImageConstants.HOME.HOME}
                style={{
                  height: 28,
                  width: 28,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
      <TabBar.Screen
        name={'NearMe'}
        component={NearMeStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color, size}) => (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 50 / 2,
                backgroundColor: Constants.COLORS.buttonColor2,
                borderColor: 'gray',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImageConstants.HOME.COMPASS}
                style={{
                  height: 26,
                  width: 26,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
      <TabBar.Screen
        name={'NuzzleUp'}
        component={NuzzleUpStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color, size}) => (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 50 / 2,
                backgroundColor: Constants.COLORS.buttonColor2,
                borderColor: 'gray',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImageConstants.HOME.FLASH}
                style={{
                  height: 22,
                  width: 22,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
      <TabBar.Screen
        name={'Chat'}
        component={ChatStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color, size}) => (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 50 / 2,
                backgroundColor: Constants.COLORS.buttonColor2,
                borderColor: 'gray',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImageConstants.HOME.CHAT}
                style={{
                  height: 23,
                  width: 23,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
    </TabBar.Navigator>
  );
}

function TabRoutes() {
  return (
    <Tab.Navigator
      shifting={false}
      barStyle={{
        backgroundColor: Constants.COLORS.buttonColor2,
      }}
      activeColor={Constants.COLORS.buttonColor1}
      inactiveColor={'blue'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          color = focused ? 'white' : Constants.COLORS.buttonColor1;
          if (route.name == 'Home') {
            return (
              <Image
                style={{height: 30, width: 30, tintColor: color}}
                resizeMode={'cover'}
                source={ImageConstants.HOME.HOMEICON}></Image>
            );
          } else if (route.name == 'EditProfile') {
            return (
              <Image
                style={{height: 25, width: 25}}
                color={color}
                resizeMode={'contain'}
                source={ImageConstants.HOME.FLASH}></Image>
            );
          }
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="EditProfile" component={EditProfile} />
      <Tab.Screen name="NuzzleUp" component={NuzzleUpStack} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function NuzzleUpStack() {
  return (
    <NuzzelRoot.Navigator headerMode="none">
      <NuzzelRoot.Screen name="NuzzleUp" component={NuzzleUp} />
      <NuzzelRoot.Screen name="Setting" component={Setting} />
      <NuzzelRoot.Screen name="Filter" component={Filter} />
      <NuzzelRoot.Screen name="Profile" component={Profile} />
      <NuzzelRoot.Screen name="EditProfile" component={EditProfile} />
      <NuzzelRoot.Screen name="UserAggrement" component={UserAggrement} />
      <NuzzelRoot.Screen name="Match" component={Match} />
      <Stack.Screen name="Requests" component={Requests}></Stack.Screen>
    </NuzzelRoot.Navigator>
  );
}

function HomeStack() {
  return (
    <HomeRoot.Navigator headerMode="none">
      {/* <Stack.Screen name="Requests" component={Requests}></Stack.Screen> */}
      <HomeRoot.Screen name="Home" component={Home} />
      <HomeRoot.Screen name="Setting" component={Setting} />
      <HomeRoot.Screen name="Filter" component={Filter} />
      <HomeRoot.Screen name="Profile" component={Profile} />
      <HomeRoot.Screen name="EditProfile" component={EditProfile} />
      <HomeRoot.Screen name="UserAggrement" component={UserAggrement} />
      <HomeRoot.Screen name="Match" component={Match} />
    </HomeRoot.Navigator>
  );
}
function NearMeStack() {
  return (
    <NearMeRoot.Navigator headerMode="none">
      <NearMeRoot.Screen name="Home" component={NearMe} />
      <NearMeRoot.Screen name="Setting" component={Setting} />
      <NearMeRoot.Screen name="EditProfile" component={EditProfile} />
      <NearMeRoot.Screen name="UserAggrement" component={UserAggrement} />
    </NearMeRoot.Navigator>
  );
}
function ChatStack() {
  return (
    <ChatRoot.Navigator headerMode="none">
      <ChatRoot.Screen name="Chat" component={Chat} />
      <ChatRoot.Screen name="Setting" component={Setting} />
      {/* <ChatRoot.Screen name="Chatting" component={Chatting} /> */}
      <NearMeRoot.Screen name="EditProfile" component={EditProfile} />
      <NearMeRoot.Screen name="UserAggrement" component={UserAggrement} />
    </ChatRoot.Navigator>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
