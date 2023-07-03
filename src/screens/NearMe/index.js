import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  StatusBar,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import Constants from '../../frequent/Constants';
const {width, height} = Dimensions.get('window');
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar, isSignedIn} from '../../frequent/Utility/Utils';
import Slider from '@react-native-community/slider';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import commonUtility from '../../../src/frequent/Utility/CommonUtility';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Secrets from '../../frequent/Secrets';
import MapStyle from '../NearMe/styles/mapStyle.json';
import {Loader} from '../../frequent/Utility/Loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as GetUserByDistanceAction from '../../redux/actions/GetUserByDistance';
import MapView, {
  PROVIDER_GOOGLE,
  Polygon,
  Marker,
  Circle,
} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
var currentLatitude = 37.8025259;
var currentLongitude = -122.4351431;
var userId = null;
var circleRadius = 0;
var tempRegion = null;
var latt = null;
var langg = null;
//var refArray = [];
// const ASPECT_RATIO =
//   Constants.DIMESIONS.WINDOWWIDTH / Constants.DIMESIONS.WIDOWHEIGHT;
// const LATITUDE_DELTA = 0.04;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class NearMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: true,
      location: false,
      radius: 10,
      matchesCount: 0,
      isLoggedIn: global.isLoggedIn,
      userListMapLocationMarkers: [],
      userListZipCodeMapLocationMarkers: [],
      zipCodeValue: '',
      // region: {
      //   latitude: 37.8025259,
      //   longitude: -122.4351431,
      //   latitudeDelta: 0.1,
      //   longitudeDelta: 0.1,
      // },
      region: {
        latitude: 18.9255728,
        longitude: 72.8242221,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      },
      PolygonArray: [],
    };
    // const self = this;
    // self.onRegionChange = this.onRegionChange.bind(this);
    // self.onLoadMoreContents = this.onLoadMoreContents.bind(this);
    // self.mapContainerStyle = this.mapContainerStyle.bind(this);
    // this.rebuildMarkers = true;
  }
  componentDidMount = async () => {
    ////////////////////////////////////////////////
    await this.props.navigation.addListener('focus', () => {
      this.setState({messageArray: []});
      //refArray = [];
      this.getUserId(); // getting userId from store
      //this.getRadius();
    });
    this.getRadius(); // getting radius from store
    this.getUserId();
  };

  componentDidCatch() {}

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
  };
  getRadius = async () => {
    await commonUtility.getStoreData(Constants.STRING.RADIUS).then((radius) => {
      this.setState({radius}, () => {
        this.getLocationData();
      });
    });
  };
  getLocationData = async () => {
    await commonUtility
      .getStoreData(Constants.STRING.LOCATION_DATA)
      .then((store) => {
        currentLatitude = store.currentLatitude;
        currentLongitude = store.currentLongitude;
        var newRegion = {
          latitude: 37.8025259,
          longitude: -122.4351431,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };

        this.setState({
          countryCode: store.countryCode,
          currentLocation: store.locationName,
          region: newRegion,
        });
      });
    this.map.fitToElements(true);
  };
  onLocationPress = () => {
    // if (Platform.OS === 'android') {
    //   //alert(typeof currentLatitude);
    //   //return;
    //   this.setState({zipCode: false, location: true}, () => {
    //     this.animateCamera(
    //       parseInt(currentLatitude),
    //       parseInt(currentLongitude),
    //     );
    //   });
    //   // commonUtility.displayToast('Error while Using Location feature.');
    //   return;
    // } else {
    //   this.setState({zipCode: false, location: true}, () => {
    //     this.animateCamera(currentLatitude, currentLongitude);
    //   });
    // }
    latt = null;
    langg = null;
    this.setState({zipCode: false, location: true}, () => {
      this.animateCamera(parseInt(currentLatitude), parseInt(currentLongitude));
    });
  };
  getLocationBasedUser = async (radius) => {
    if (isLoggedIn) {
      const formData = new FormData();
      formData.append(ApiConstants.UID, userId);
      formData.append(ApiConstants.LATITUDE, Number(currentLatitude));
      formData.append(ApiConstants.LONGTITUDE, Number(currentLongitude));
      formData.append(ApiConstants.DISTANCE_RANGE, Number(radius));
      //or
      // formData.append(ApiConstants.UID, userId);
      // formData.append(ApiConstants.LATITUDE, 30.3452);
      // formData.append(ApiConstants.LONGTITUDE, 76.7821);
      // formData.append(ApiConstants.DISTANCE_RANGE, Number(radius));
      console.log('formdata.getLocationBasedUser', JSON.stringify(formData));
      this.props.actions.GetUserByDistanceTo.getUserByDistanceRequest(
        formData,
        this.onSuccessLocationLoadUser,
        this.onFailureLocationLoadUser,
      );
    } else {
      commonUtility.displayToast('Please login first');
    }
  };

  onSuccessLocationLoadUser = async (inheritedData) => {
    //  console.log('onSuccessLocationLoadUser=>', inheritedData.data);
    var data = inheritedData.data;
    this.setState({
      userListMapLocationMarkers: data,
      matchesCount: data.length,
    });

    var newRegion = {
      latitude: Number(currentLatitude),
      longitude: Number(currentLongitude),
      latitudeDelta: circleRadius > 25000 ? 1.1 : 0.5,
      longitudeDelta: circleRadius > 25000 ? 1.1 : 0.5,
    };
    this.setState({
      region: newRegion,
    });

    this.MapView.animateToRegion(newRegion, 100);
    //this.MapView.fitToElements(true);
  };

  onFailureLocationLoadUser = async (error) => {
    this.setState({userListMapLocationMarkers: []});
    console.log('onFailureLocationLoadUser', error);
  };

  animateCamera(currentLatitude, currentLongitude) {
    const {radius, location} = this.state;
    var newRegion = {
      latitude: Number(currentLatitude),
      longitude: Number(currentLongitude),
      latitudeDelta: 0.4,
      longitudeDelta: 0.4,
    };
    this.setState({
      region: newRegion,
    });

    this.MapView.animateToRegion(newRegion, 100);
    if (location) {
      if (radius) {
        var r = this.state.radius.split(' '); // removing miles text from radius
        this.getLocationBasedUser(r[0]);
        circleRadius = r[0] * 1000;
      }
    }
  }

  onSliderValueChange(radius) {
    this.setState({radius: parseInt(radius) + ' miles'}, () => {
      var r = this.state.radius.split(' '); // removing miles text from radius
      data = r[0];
      this.getLocationBasedUser(r[0]);
      circleRadius = r[0] * 1000;
      //alert(circleRadius);
    });
  }
  //  ZIPCODE STARTS @d9n6
  onZipCodePress = () => {
    latt = null;
    langg = null;
    this.setState({zipCode: true, location: false}, () => {
      this.animateCameraZipCode(currentLatitude, currentLongitude);
    });
  };

  animateCameraZipCode(lat, lng) {
    var newRegion = {
      latitude: Number(lat),
      longitude: Number(lng),
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
    tempRegion = newRegion;
    //this.MapView.animateToRegion(newRegion, 100);
    //console.log('newRegion=>', JSON.stringify(newRegion));
    //this.getZipcodeBasedUser();
    // this.setState({
    //   region: newRegion,
    // });

    setTimeout(() => {
      this.MapView.animateToRegion(newRegion, 100);
      //this.getZipcodeBasedUser();
    }, 1000);

    // if (location) {
    //   var r = this.state.radius.split(' '); // removing miles text from radius
    //   this.getLocationBasedUser(r[0]);
    //   circleRadius = r[0] * 1000;
    // }
  }

  getZipcodeBasedUser = async () => {
    this.setState({region: tempRegion});
    if (isLoggedIn) {
      const formData = new FormData();
      formData.append(ApiConstants.UID, userId);
      formData.append(ApiConstants.ZIP_CODE, this.state.zipCodeValue);
      console.log('formdata.getZipcodeBasedUser', JSON.stringify(formData));
      this.props.actions.GetUsersByZipCodeTo.getUserByZipCodeRequest(
        formData,
        this.onSuccessLoadZipCodeUser,
        this.onFailureLoadZipCodeUser,
      );
    } else {
    }
  };

  onSuccessLoadZipCodeUser = async (inheritedData) => {
    console.log('onSuccessLoadZipCodeUser=>', inheritedData.data);
    var data = inheritedData.data;
    this.setState(
      {
        userListZipCodeMapLocationMarkers: data,
        matchesCount: data.length,
      },
      () => {
        this.animateCameraZipCode(latt, langg);
      },
    );

    // this.MapView.animateToRegion(tempRegion, 100);

    // var newRegion = {
    //   latitude: Number(currentLatitude),
    //   longitude: Number(currentLongitude),
    //   latitudeDelta: circleRadius > 25000 ? 1.1 : 0.5,
    //   longitudeDelta: circleRadius > 25000 ? 1.1 : 0.5,
    // };
    // this.setState({
    //   region: newRegion,
    // });

    // this.MapView.animateToRegion(newRegion, 100);
    //this.MapView.fitToElements(true);
  };

  onFailureLoadZipCodeUser = async (error) => {
    //this.setState({userListMapLocationMarkers: []});
    console.log('onFailureLoadZipCodeUser', error);
  };
  onZipCodeChange = async (zip) => {
    this.setState({zipCodeValue: zip, userListZipCodeMapLocationMarkers: []});
    if (zip) {
      if (zip.length == 6) {
        await this.getCoordinatesZipCode(zip);
      }
    }
  };
  getCoordinatesZipCode = async (CODE) => {
    //get location from zip code
    await fetch(
      Constants.BASE_URL.MAP__ +
        CODE.toString() +
        Constants.BASE_URL.KEY__ +
        Secrets.MAPS_API_KEY.API_KEY,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log('getCoordinatesZipCode.data>>>>>>>>', data);

          if (data.status == 'OK') {
            if (data.results[0].geometry) {
              //'ZERO_RESULTS'
              latt = data?.results[0]?.geometry?.location?.lat;
              langg = data?.results[0]?.geometry?.location?.lng;
              // console.log(
              //   'data>>>>>>>>',
              //   data?.results[0]?.geometry?.location?.lat,
              //   data?.results[0]?.geometry?.location?.lng,
              // );
              //get points from this
              this.getPloygonPoints(CODE);
            }
          }
        } else if (data.status == 'ZERO_RESULTS') {
          commonUtility.displayToast('Sorry No Information found.');
        }
      });
  };

  getPloygonPoints = async (CODE) => {
    const {countryCode} = this.state;
    /// get points
    await fetch(
      Constants.BASE_URL.GEO_CODE +
        CODE.toString() +
        `&country=` +
        countryCode +
        `&username=` +
        `shivam`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('getPloygonPoints.data>>>>>>>>', data);
        if (data) {
          const {postalcodes} = data; //obj destructuring
          if (postalcodes) {
            if (postalcodes.length > 0) {
              var arrayData = [];
              postalcodes.map((item) => {
                var obj = {latitude: item.lat, longitude: item.lng};
                arrayData.push(obj);
              });

              this.setState({PolygonArray: arrayData}, () => {
                this.getZipcodeBasedUser();
                //this.animateCameraZipCode(latt, langg);
              });
            }
          }
        }
      });
  };
  getCoordinates = async (CODE) => {
    await fetch(
      Constants.BASE_URL.MAP__ +
        CODE.toString() +
        Constants.BASE_URL.KEY__ +
        Secrets.MAPS_API_KEY.API_KEY,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (data.status == 'OK') {
            if (data.results[0].geometry) {
              //'ZERO_RESULTS'
              let latt = data?.results[0]?.geometry?.location?.lat;
              let langg = data?.results[0]?.geometry?.location?.lng;
              console.log(
                'data>>>>>>>>',
                data?.results[0]?.geometry?.location?.lat,
                data?.results[0]?.geometry?.location?.lng,
              );

              return;
              let polTempArray = [
                {
                  latitude: data?.results[0]?.geometry?.bounds?.northeast.lat,
                  longitude: data?.results[0]?.geometry?.bounds?.northeast.lng,
                },
                {
                  latitude: data?.results[0]?.geometry?.bounds?.southwest.lat,
                  longitude: data?.results[0]?.geometry?.bounds?.southwest.lng,
                },
                {
                  latitude: data?.results[0]?.geometry?.location.lat,
                  longitude: data?.results[0]?.geometry?.location.lng,
                },
              ];
              this.setState({PolygonArray: polTempArray}, () => {
                this.animateCameraZipCode(latt, langg);
              });

              console.log('newData=>', JSON.stringify(data));
              console.log(
                'getCoordinates.northeast=>',
                JSON.stringify(data.results[0].geometry.bounds.northeast),
              );
              console.log(
                'getCoordinates.southwest=>',
                JSON.stringify(data.results[0].geometry.bounds.southwest),
              );
              console.log(
                'getCoordinates.Location=>',
                JSON.stringify(data.results[0].geometry.location),
              );
            }
          } else if (data.status == 'ZERO_RESULTS') {
            commonUtility.displayToast('Sorry No Information found.');
          }
        }
      });
  };

  mapMarkers() {
    return this.state.userListMapLocationMarkers.map((markerDeails) => {
      console.log('markerDeails.profile_pic', typeof markerDeails.latitude);
      const id = markerDeails.uid;
      const profile_pic = markerDeails.profile_pic;
      return (
        <Marker
          //centerOffset={(0.1, 0.8)}
          //flat={false}
          //anchor={(0.7, 0.6)}
          //calloutAnchor={(0.69, 0.7)}
          //stopPropagation={false}
          //paddingAdjustmentBehavior="always"
          key={markerDeails.uid}
          onPress={() =>
            this.props.navigation.navigate(Constants.ROUTENAME.PROFILE, {id})
          }
          tracksViewChanges={false}
          coordinate={{
            // latitude: parseInt(markerDeails.latitude),
            // longitude: parseInt(markerDeails.longitude),
            // latitude:
            //   typeof markerDeails.latitude == 'string'
            //     ? parseInt(markerDeails.latitude)
            //     : markerDeails.latitude,
            // longitude:
            //   typeof markerDeails.longitude == 'string'
            //     ? parseInt(markerDeails.longitude)
            //     : markerDeails.longitude,
            latitude: markerDeails.latitude,
            longitude: markerDeails.longitude,
          }}>
          <View
            style={{flex: 1, alignItems: 'center', padding: 5, marginLeft: 0}}>
            <Image
              source={{
                uri: profile_pic[0],
              }}
              onLoadEnd={() => console.log('Marker image has been loaded!')}
              style={{
                width: 45,
                height: 45,
                //backgroundColor: Constants.COLORS.buttonColor2,
                borderRadius: 45 / 2,
              }}></Image>
            <View
              style={{
                backgroundColor: Constants.COLORS.buttonColor2,
                height: 30,
                marginTop: 4,
                paddingHorizontal: 20,
                borderRadius: 7,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  color: Constants.COLORS.whiteColor,
                  marginTop: 5,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {markerDeails.name}
              </Text>
            </View>
          </View>
        </Marker>
      );
    });
  }
  renderZipcodeMapMarkers() {
    return this.state.userListZipCodeMapLocationMarkers.map((markerDeails) => {
      console.log('markerDeails.profile_pic', typeof markerDeails.latitude);
      const id = markerDeails.uid;
      const profile_pic = markerDeails.profile_pic;
      return (
        <Marker
          //centerOffset={(0.1, 0.8)}
          //flat={false}
          //anchor={(0.7, 0.6)}
          //calloutAnchor={(0.69, 0.7)}
          //stopPropagation={false}
          //paddingAdjustmentBehavior="always"
          key={markerDeails.uid}
          onPress={() =>
            this.props.navigation.navigate(Constants.ROUTENAME.PROFILE, {id})
          }
          tracksViewChanges={false}
          coordinate={{
            // latitude: parseInt(markerDeails.latitude),
            // longitude: parseInt(markerDeails.longitude),
            // latitude:
            //   typeof markerDeails.latitude == 'string'
            //     ? parseInt(markerDeails.latitude)
            //     : markerDeails.latitude,
            // longitude:
            //   typeof markerDeails.longitude == 'string'
            //     ? parseInt(markerDeails.longitude)
            //     : markerDeails.longitude,
            latitude: markerDeails.latitude,
            longitude: markerDeails.longitude,
          }}>
          <View
            style={{flex: 1, alignItems: 'center', padding: 5, marginLeft: 0}}>
            <Image
              source={{
                uri: profile_pic[0],
              }}
              onLoadEnd={() => console.log('Marker image has been loaded!')}
              style={{
                width: 45,
                height: 45,
                //backgroundColor: Constants.COLORS.buttonColor2,
                borderRadius: 45 / 2,
              }}></Image>
            <View
              style={{
                backgroundColor: Constants.COLORS.buttonColor2,
                height: 30,
                marginTop: 4,
                paddingHorizontal: 20,
                borderRadius: 7,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  color: Constants.COLORS.whiteColor,
                  marginTop: 5,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {markerDeails.name}
              </Text>
            </View>
          </View>
        </Marker>
      );
    });
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
          // onPress={() => this.props.navigation.goBack()}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            //  marginTop: heightToDp(5),
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
            //  marginTop: heightToDp(5)
          }}>
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
            alignItems: 'center',
            //marginTop: heightToDp(5),
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
  renderRow() {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(Constants.ROUTENAME.CHATTING)
        }
        style={{
          borderBottomWidth: 1,
          height: 110,
          backgroundColor: 'white',
          marginTop: 10,
          flexDirection: 'row',
          paddingHorizontal: 5,
          alignItems: 'center',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
        }}>
        <ImageBackground
          style={{
            height: 70,
            width: 70,
          }}
          imageStyle={{borderRadius: 100 / 2}}
          resizeMode={'cover'}
          source={ImageCostants.PROFILE.USERPROFILE}></ImageBackground>
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
              Kira
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Constants.COLORS.seeyouback,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {'09:40 am'}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              color: Constants.COLORS.seeyouback,
              fontFamily: Constants.FONTFAMILY.REGULAR,
            }}>
            {
              'Hey! how was the concert last night? Hey! how was the concert last night?'
            }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const {
      zipCode,
      location,
      radius,
      currentLocation,
      matchesCount,
      isLoggedIn,
      userListMapLocationMarkers,
      PolygonArray,
    } = this.state;

    return (
      <>
        <SafeAreaProvider>
          <View style={{flex: 1, backgroundColor: Constants.COLORS.whiteColor}}>
            <Statusbar />
            {this.renderHeader()}
            <Modal
              animated={true}
              transparent={true}
              visible={this.props.isLoading}>
              <Loader />
            </Modal>
            <View
              style={{
                height: 70,
                //flex: 1,
                //marginHorizontal: 20,
                backgroundColor: Constants.COLORS.buttonColor2,
              }}>
              <View
                style={{
                  height: 45,
                  marginTop: 10,
                  //flex: 1,
                  marginHorizontal: 30,
                  borderRadius: 10,
                  backgroundColor: Constants.COLORS.buttonColor2,
                  borderColor: Constants.COLORS.borderColor,
                  borderWidth: 1,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => [
                    this.onZipCodePress(),
                    //this.animateCameraZipCode(37.8025259, -122.4351431),
                  ]}
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: zipCode
                      ? Constants.COLORS.seeyouback
                      : Constants.COLORS.buttonColor2,
                    borderTopLeftRadius: 10,
                    borderBottomStartRadius: 10,
                  }}>
                  <ImageBackground
                    style={{height: 25, width: 25}}
                    imageStyle={{resizeMode: 'contain'}}
                    source={
                      zipCode
                        ? ImageCostants.SPLASH.LOCATIONWHITE
                        : ImageCostants.SPLASH.LOCATIONGRAY
                    }></ImageBackground>
                  <Text
                    style={{
                      color: zipCode
                        ? Constants.COLORS.whiteColor
                        : Constants.COLORS.tinyGrey,
                      fontSize: 18,
                      marginLeft: 10,
                      fontFamily: Constants.FONTFAMILY.BOLD,
                    }}>
                    Zip Code
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => [this.onLocationPress()]}
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: location
                      ? Constants.COLORS.seeyouback
                      : Constants.COLORS.buttonColor2,
                    borderTopEndRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <ImageBackground
                    style={{height: 35, width: 35}}
                    imageStyle={{resizeMode: 'contain'}}
                    source={
                      location
                        ? ImageCostants.SPLASH.MARKERWHITE
                        : ImageCostants.SPLASH.MARKERGRAY
                    }></ImageBackground>
                  <Text
                    style={{
                      color: location
                        ? Constants.COLORS.whiteColor
                        : Constants.COLORS.tinyGrey,
                      fontSize: 20,
                      marginLeft: 10,
                      fontFamily: Constants.FONTFAMILY.BOLD,
                    }}>
                    Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.map}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                // style={
                //   Platform.OS === 'ios'
                //     ? {flex: 1}
                //     : {minHeight: height - heightToDp(80)}
                // }
                style={{flex: 1}}
                ref={(ref) => {
                  this.MapView = ref;
                }}
                customMapStyle={MapStyle}
                showsMyLocationButton={false}
                showsPointsOfInterest={false}
                //showsUserLocation={zipCode ? false : true}
                //followsUserLocation={zipCode ? false : true}
                showsTraffic={true}
                tintColor="red"
                // annotations={userListMapLocationMarkers}
                pitchEnabled={true}
                loadingEnabled={true}
                //showsCompass={true}
                region={this.state.region}
                //onRegionChange={(region) => alert(JSON.stringify(region))}
              >
                {zipCode ? (
                  PolygonArray.length > 0 && (
                    <>
                      {this.renderZipcodeMapMarkers()}
                      <Polygon
                        zIndex={2}
                        // coordinates={[
                        //   //{latitude: 37.8025259, longitude: -122.4351431},
                        //   //{latitude: 37.7896386, longitude: -122.421646},
                        //   // {latitude: 37.7665248, longitude: -122.4161628},
                        //   // {latitude: 37.7734153, longitude: -122.4577787},
                        //   // {latitude: 37.7948605, longitude: -122.4596065},
                        //   // {latitude: 37.8025259, longitude: -122.4351431},
                        //   // {
                        //   //   latitude: parseInt(currentLatitude),
                        //   //   longitude: parseInt(currentLongitude),
                        //   // },
                        //   // {
                        //   //   latitude: parseInt(currentLatitude),
                        //   //   longitude: parseInt(currentLongitude),
                        //   // },
                        //   // {
                        //   //   latitude: parseInt(currentLatitude),
                        //   //   longitude: parseInt(currentLongitude),
                        //   // },

                        //   // {latitude: 18.9255728, longitude: 72.8242221},
                        //   // {latitude: 18.9194774, longitude: 72.8179999},
                        //   // {latitude: 18.9315682, longitude: 72.82809139999999},
                        //   // {latitude: 30.15018, longitude: 76.85885},
                        //   // {latitude: 30.15018, longitude: 76.85885},
                        //   // {latitude: 30.15018, longitude: 76.85885},
                        //   // {latitude: 30.15018, longitude: 76.85885},
                        //   // {latitude: 30.15018, longitude: 76.85885},
                        //   {latitude: 29.87564, longitude: 77.80635},
                        //   {latitude: 29.94958, longitude: 77.54769},
                        //   {latitude: 29.87564, longitude: 77.80635},
                        //   {latitude: 29.87564, longitude: 77.80635},
                        //   {latitude: 29.87564, longitude: 77.80635},
                        // ]}
                        //holes={PolygonArray}
                        // coordinates={[
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.797785,
                        //     latitude: 30.209564,
                        //   },
                        //   {
                        //     longitude: 76.835178,
                        //     latitude: 30.07461,
                        //   },
                        //   {
                        //     longitude: 76.910521,
                        //     latitude: 30.150797,
                        //   },
                        //   {
                        //     longitude: 76.818716,
                        //     latitude: 30.155638,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.935909,
                        //     latitude: 30.110853,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.845289,
                        //     latitude: 30.149077,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.825865,
                        //     latitude: 30.182773,
                        //   },
                        //   {
                        //     longitude: 76.77877,
                        //     latitude: 30.177299,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     adminCode2: '072',
                        //     adminName3: 'Shahbad',
                        //     adminCode1: '10',
                        //     adminName2: 'Kurukshetra',
                        //     lng: 76.920309,
                        //     countryCode: 'IN',
                        //     postalcode: '136135',
                        //     adminName1: 'Haryana',
                        //     placeName: 'Rawa',
                        //     lat: 30.176241,
                        //   },
                        //   {
                        //     adminCode2: '072',
                        //     adminName3: 'Shahbad',
                        //     adminCode1: '10',
                        //     adminName2: 'Kurukshetra',
                        //     lng: 76.85884527272725,
                        //     countryCode: 'IN',
                        //     postalcode: '136135',
                        //     adminName1: 'Haryana',
                        //     placeName: 'Samalkhi',
                        //     lat: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.85884527272725,
                        //     latitude: 30.150177000000006,
                        //   },
                        //   {
                        //     longitude: 76.82733,
                        //     latitude: 30.123669,
                        //   },
                        // ]}
                        geodesic={true}
                        coordinates={PolygonArray}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        // strokeColors={[
                        //   '#7F0000',
                        //   '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                        //   '#B24112',
                        //   '#E5845C',
                        //   '#238C23',
                        //   '#7F0000',
                        // ]}
                        fillColor={Constants.COLORS.buttonColor3}
                        strokeWidth={1}></Polygon>
                    </>
                  )
                ) : (
                  <>
                    {/* {this.mapMarkers()} */}

                    <Circle
                      key={1}
                      radius={circleRadius}
                      zIndex={2}
                      strokeWidth={2}
                      fillColor={Constants.COLORS.buttonColor1}
                      strokeColor="blue"
                      //center={{latitude: 30.3452, longitude: 76.7821}}
                      center={{
                        latitude: parseInt(currentLatitude),
                        longitude: parseInt(currentLongitude),
                      }}></Circle>
                  </>
                )}
              </MapView>
            </View>
          </View>
        </SafeAreaProvider>
        <KeyboardAvoidingView>
          <View
            style={{
              height: 85,
              backgroundColor: Constants.COLORS.buttonColor2,
              flexDirection: Constants.STRING.ROW,
            }}>
            <View style={{flex: 0.5, margin: 20}}>
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 16,
                  marginLeft: 0,
                  fontFamily: Constants.FONTFAMILY.BOLD,
                }}>
                {currentLocation}
              </Text>
              <Text
                style={{
                  color: Constants.COLORS.whiteColor,
                  fontSize: 15,
                  marginTop: 4,
                  fontFamily: Constants.FONTFAMILY.REGULAR,
                }}>
                {matchesCount + ' matches in this area'}
              </Text>
            </View>

            <View style={{flex: 0.5, margin: 20}}>
              {zipCode && (
                <TextInput
                  placeholder="Zip Code"
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor={Constants.COLORS.whiteColor}
                  onChangeText={(zipCodeValue) =>
                    this.onZipCodeChange(zipCodeValue)
                  }
                  style={{
                    textAlign: 'center',
                    height: 35,
                    fontSize: 13,
                    color: Constants.COLORS.whiteColor,
                    borderRadius: 6,
                    width: '70%',
                    alignSelf: 'flex-end',
                    borderColor: Constants.COLORS.borderColor,
                    borderWidth: 2,
                    fontFamily: Constants.FONTFAMILY.REGULAR,
                    backgroundColor: Constants.COLORS.buttonColor2,
                  }}></TextInput>
              )}
              {location && isLoggedIn && (
                <View
                  style={{
                    flexDirection: Constants.STRING.ROW,
                    alignItems: 'center',
                  }}>
                  <Slider
                    value={radius == null ? 1000 : parseInt(radius)}
                    style={{width: '70%', height: 40, marginLeft: 0}}
                    minimumValue={10}
                    maximumValue={50}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onSlidingComplete={(radius) =>
                      this.onSliderValueChange(radius)
                    }
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      color: Constants.COLORS.whiteColor,
                      fontSize: 14,
                      marginTop: 0,
                      fontFamily: Constants.FONTFAMILY.REGULAR,
                    }}>
                    {radius}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    zIndex: 1,
    top: Platform.OS === 'ios' ? 185 : 135,
    left: 0,
    right: 0,
    bottom: 0,
    //  flex: 1,
  },
});
const mapStateToProps = (state) => ({
  isLoading: state.getUserByDistanceReducer.isLoading,
  userLoginData: state.loginReducer.userData,
  userVerifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
});

//redux function for GetUserByDistance
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      GetUserByDistanceTo: bindActionCreators(
        GetUserByDistanceAction,
        dispatch,
      ),
      GetUsersByZipCodeTo: bindActionCreators(
        GetUserByDistanceAction,
        dispatch,
      ),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NearMe);
