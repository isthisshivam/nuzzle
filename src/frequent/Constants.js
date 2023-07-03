import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import ImageConstants from './ImageConstants';
export default {
  DIMESIONS: {
    WINDOWWIDTH: Dimensions.get('window').width,
    WIDOWHEIGHT: Dimensions.get('window').height,
  },
  MESSAGE_FOR_USER: {
    NEED_TO_LOGIN: 'Please Signup or Login first to use Services.',
  },
  COLORS: {
    borderColor: '#454f63',
    //buttonColor1: '#3acce1',
    buttonColor1: '#5813cc',
    buttonColor2: '#2a2e42',
    buttonColor3: '#c840e9',
    buttonColor4: '#f61796d9',
    tabbarback: '#022F5C',
    buttonback: '#FBE5E5',
    usernamecolr: '#3c415c',
    seeyouback: '#34394f',
    tintColor: '#FAC600',
    darkColor: '#1c1e2c',
    semiDarkColor: '#23273c',
    accentColor: '#319DDB',
    accentColorDark: '#1664A1',
    dividerDark: '#c2c2c2',
    errorColor: '#FE0000',
    goldColor: '#ffc300',
    whiteColor: '#fff',
    blackColor: '#000',
    successColor: '#0ed341',
    greyLight: '#cfd1d4',
    transparent: 'transparent',
    tinyGrey: '#757575',
    death: '#f8c8cf',
    recovered: '#31B991',
    headerBackGroundColor: '#8f0412',
    textColor1: '#272636',
    backforMenu: '#1A1927',
    viewback: 'rgba(236,222,222,0.45)',
  },

  STRING: {
    MOTIVATE_USER: 'Uploading profile pic give you more NuZZles',
    IMPROVEMENT: 'Improvement',
    CONGRATES_MANY_PHOTOS: 'You have added 6+ photos to your Profile!',
    CONGRATES_SURVEY1: 'You have give us survey report',
    INVERSE: 'inverse',
    UPGRADE: 'You can upgrade yourself',
    SCLALERTMESSAGE:
      'Please choose preferred gender and select range where we will find out matches for you.',
    PARAGRAPH: 'paragraph',
    CARD: 'cardAvatar',
    UPDATE_PROFILE: 'Want to NuZZleUp? Let’s Complete your profile first',
    WOULD_LIKE: 'Would you like to survey?',
    WELCOME: 'Welcome!',
    WLECOME_SUBTITLE:
      'Please choose preferred gender and select range where we will find out matches for you.',
    PREFER_RADIUS: 'Select Preferred Radius',
    I_AM_SEEKING: 'I am seeking a...',
    NUZZLE_WITH_HUE: ' nuzzles!',
    CONGRATES_HEAD_TO_TOE_SECOND: "A user  marked your photo 'Head-To-Toe'",
    NUZZLE_WITH_QUES: ' nuzzles!',
    YOU_EARNED: "you've earned ",
    CONGRATES_HEAD_TO_TOE: "You marked a user's photo 'Head-To-Toe'",
    NUZZLE_WITH_DOT: ' nuzzles.',
    WILL_COST: 'This will cost ',
    MATCH_REQUESTED: 'You have requested to match with',
    ZERO: 0,
    OOPS_SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_SOMETIME:
      "Oop's Something went wrong please try again after some time",
    TERMSANDCONDITION: 'Terms & Conditions',
    MESSAGES: 'messages',
    MESSAGES_COLLECTION: 'MESSAGES',
    CREATED_AT: 'created_at',
    AGE: 'AGE',
    GENDER: 'GENDER',
    RADIUS: 'RADIUS',
    CUSTOM_FILTER_ARRAY: 'CUSTOM_FILTER_ARRAY',
    LOCATION_DATA: 'LOCATION_DATA',
    FREE_MATCH_COUNT: 'FREE_MATCH_COUNT',
    FREE_MESSAGES_COUNT: 'FREE_MESSAGES_COUNT',
    ADD_POINTS_IF_USER_COMPLETED_HIS_PROFILE_PICS:
      'ADD_POINTS_IF_USER_COMPLETED_HIS_PROFILE_PICS',
    GET_DATE: 'GET_DATE',
    ZERO: '0',
    FCM_TOKEN: 'FCM_TOKEN',
    CENTER: 'center',
    FLEXSTART: 'flex-start',
    FLEXEND: 'flex-end',
    ROW: 'row',
    SPACEBETWEEN: 'space-between',
    PRODUCTS: 'Products',
    ORDERPLACED: 'Order Placed',
    SEARCHSTRING: 'Search for your favourite dishes',
    ENTEREMAIL: 'Enter you e-mail',
    ENTERPASSWORD: 'Enter your password',
    USERNAME: 'Username',
    ENTEREMAILSEC: 'email-address',
    FIRSTNAME: 'First Name',
    LASTNAME: 'Last Name',
    PHONE: 'Mobile Number',
    CONFIRMPASSWORD: 'Confirm password',
    CREATEPASSWORD: 'Create password',
    HAVEANACC: 'Already have an account ? SIGN IN',
    LOGIN_USER_DETAILS: 'loginData',
    TOKEN: 'token',
  },
  ROUTENAME: {
    SPLASH: 'Splash',
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOTPASSWORD: 'ForgotPassword',
    VERIFICATION: 'Verification',
    HOME: 'Home',
    CHAT: 'Chat',
    SETTING: 'Setting',
    PROFILE: 'Profile',
    FILTER: 'Filter',
    CHATTING: 'Chatting',
    EDITPROFILE: 'EditProfile',
    NEARME: 'NearMe',
    MATCH: 'Match',
    USERAGREMENT: 'UserAggrement',
  },
  FONTSIZE: {
    BaseFontSize: 21,
  },

  HEIGHTWIDTH: {
    BASEHEIGHT: 20,
    BASEWIDTH: 20,
  },
  FONTFAMILY: {
    BOLD: 'gibson-bold',
    BOLDITALIC: 'Gibson-BoldItalic',
    REGULARITALIC: 'Gibson-RegularItalic',
    REGULAR: 'Gibson-Regular',
  },

  BASE_URL: {
    //  URL: 'http://rapidsofts.com/nuzzle/backend/web/api/',
    URL: 'http://3.141.222.59/nuzzle/backend/web/api/',
    TERMSANDCONDITION: 'http://3.141.222.59/nuzzle/backend/web/site/term',
    PRIVACY_POLICY: 'http://3.141.222.59/nuzzle/backend/web/site/policy',
    AGGREMENT: 'http://3.141.222.59/nuzzle/backend/web/site/agreement',
    MAP__: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
    KEY__: '&key=',
    GEO_CODE:
      'http://api.geonames.org/postalCodeLookupJSON?formatted=true&postalcode=',
  },

  API_ENDPOINT: {
    LOGIN: 'login',
  },

  fontSizeH1() {
    return this.FONTSIZE.BaseFontSize * 1.3;
  },
  fontSizeH2() {
    return this.FONTSIZE.BaseFontSize * 1.2;
  },
  fontSize3() {
    return this.FONTSIZE.BaseFontSize * 1.1;
  },
  fontSizeH4() {
    return this.FONTSIZE.BaseFontSize * 1.0;
  },
  AGE_RANGE_ARRAY: [
    {
      value: 18,
    },
    {
      value: 19,
    },
    {
      value: 20,
    },
    {
      value: 21,
    },
    {
      value: 22,
    },
    {
      value: 23,
    },
    {
      value: 24,
    },
    {
      value: 25,
    },
    {
      value: 26,
    },
    {
      value: 27,
    },
    {
      value: 28,
    },
    {
      value: 29,
    },
    {
      value: 30,
    },
    {
      value: 32,
    },
    {
      value: 32,
    },
    {
      value: 33,
    },
    {
      value: 34,
    },
    {
      value: 35,
    },
    {
      value: 36,
    },
    {
      value: 37,
    },
    {
      value: 38,
    },
    {
      value: 39,
    },
    {
      value: 40,
    },
    {
      value: 42,
    },
    {
      value: 42,
    },
    {
      value: 43,
    },
    {
      value: 44,
    },
    {
      value: 45,
    },
    {
      value: 46,
    },
    {
      value: 47,
    },
    {
      value: 48,
    },
    {
      value: 49,
    },
    {
      value: 50,
    },
    {
      value: 51,
    },
    {
      value: 52,
    },
    {
      value: 53,
    },
    {
      value: 54,
    },
    {
      value: 55,
    },
    {
      value: 56,
    },
    {
      value: 57,
    },
    {
      value: 58,
    },
    {
      value: 59,
    },
    {
      value: 60,
    },
    {
      value: 61,
    },
    {
      value: 62,
    },
    {
      value: 63,
    },
    {
      value: 64,
    },
    {
      value: 65,
    },
    {
      value: 66,
    },
    {
      value: 67,
    },
    {
      value: 68,
    },
    {
      value: 69,
    },
    {
      value: 70,
    },
    {
      value: 71,
    },
    {
      value: 72,
    },
    {
      value: 73,
    },
    {
      value: 74,
    },
    {
      value: 75,
    },
    {
      value: 76,
    },
    {
      value: 78,
    },
    {
      value: 79,
    },
    {
      value: 80,
    },
    {
      value: 81,
    },
    {
      value: 82,
    },
    {
      value: 83,
    },
    {
      value: 84,
    },
    {
      value: 85,
    },
    {
      value: 86,
    },
    {
      value: 87,
    },
    {
      value: 88,
    },
    {
      value: 89,
    },
    {
      value: 90,
    },
    {
      value: 91,
    },
    {
      value: 92,
    },
    {
      value: 93,
    },
    {
      value: 94,
    },
    {
      value: 95,
    },
    {
      value: 96,
    },
    {
      value: 97,
    },
    {
      value: 98,
    },
    {
      value: 99,
    },
  ],
};
