import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
} from 'react-native';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, StatusbarA} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
import OutlineButton from '../../components/OutlineButton';
import loginReducer from '../../redux/reducers/LoginReducer';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import commonUtility from '../../../src/frequent/Utility/CommonUtility';
export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    //console.log('DYNAMICS SPLASH', Constants.DIMESIONS.WINDOWWIDTH);
  }
  componentDidMount() {
    this.getOneTimeLocation();
  }

  getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        console.log('getOneTimeLocation position ', position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //console.log('getOneTimeLocation currentLongitude ', currentLongitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        // console.log('getOneTimeLocation currentLatitude ', currentLongitude);
        this.getLocationNameThroughLatLng(currentLatitude, currentLongitude);
      },
      (error) => {
        console.log('erroelocationfectihg=', error.message);
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
    console.log('getLocationNameThroughLatLng>>>>>>>>> ', res);

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
    //storing location data in to store
    await commonUtility.setStoreData(
      Constants.STRING.LOCATION_DATA,
      JSON.stringify(location),
    );
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={{
            height: Constants.DIMESIONS.height,
            width: Constants.DIMESIONS.width,
            flex: 1,
          }}
          source={ImageCostants.SPLASH.SPLASHBACKGROUND}>
          <StatusbarA />
          <ImageBackground
            style={{
              height: 120,
              width: '100%',
              alignSelf: 'center',
              marginTop: heightToDp(40),
            }}
            resizeMode="contain"
            source={ImageCostants.SPLASH.SPLASHLOGO}></ImageBackground>
          <ScrollView>
            <View style={{marginTop: heightToDp(50), alignItems: 'center'}}>
              <CustomizedButton
                handelPress={() =>
                  this.props.navigation.navigate(Constants.ROUTENAME.LOGIN)
                }
                text={'LOGIN'}
                textColor={Constants.COLORS.whiteColor}
                backgroundColor={Constants.COLORS.buttonColor1}
                marginFromTop={0}
              />
              <OutlineButton
                handelPress={() =>
                  this.props.navigation.navigate(Constants.ROUTENAME.REGISTER)
                }
                text={'SIGN UP'}
                textColor={Constants.COLORS.whiteColor}
                backgroundColor={Constants.COLORS.transparent}
                marginFromTop={20}
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
