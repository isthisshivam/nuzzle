/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  Modal,
  Switch,
  StatusBar,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../../frequent/Constants';
import Secrets from '../../frequent/Secrets';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar} from '../../frequent/Utility/Utils';
import BottomSheetView from '../../components/BottomSheetView';
import commonUtility from '../../../src/frequent/Utility/CommonUtility';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as FilterAction from '../../redux/actions/FilterAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
//import Slider from '@react-native-community/slider';
//import Slider from 'rn-range-slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Loader} from '../../frequent/Utility/Loader';
import LoaderComponent from '../../components/LoaderComponent';
import CheckBox from '@react-native-community/checkbox';
//import RangeSlider from '@jesster2k10/react-native-range-slider';
// import Rail from '../../components/Rail';
// import Notch from '../../components/Notch';
// import RailSelected from '../../components/RailSelected';
// import Thumb from '../../components/Thumb';
// import Label from '../../components/Label';
// const renderThumb = useCallback(() => <Thumb/>, []);
// const renderRail = useCallback(() => <Rail/>, []);
// const renderRailSelected = useCallback(() => <RailSelected/>, []);
// const renderLabel = useCallback(value => <Label text={value}/>, []);
// const renderNotch = useCallback(() => <Notch/>, []);
// const handleValueChange = useCallback((low, high) => {
//   setLow(low);
//   setHigh(high);
// }, []);
//////////////////////////////////////////////
var userId = null;
var customFilterArrayData = [];
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customFilter: false,
      willShowGenderRBSheet: false,
      willShowRadiusRBSheet: false,
      radius: '10 miles',
      gender: 'Male',
      age: '-',
      currentLocation: '',
      currentLatitude: '',
      currentLongitude: '',
      ageSheetOpened: false,
      minimumAgeRange: 0,
      maximumAgeRange: 0,
      customFilterArray: [
        {value: 'Asian', isSelected: false, index: 0},
        {value: 'Black/African', isSelected: false, index: 1},
        {value: 'Caucasian', isSelected: false, index: 2},
        {value: 'Hispanic/Latinx', isSelected: false, index: 3},
        {value: 'Black', isSelected: false, index: 4},
        {value: 'Native American', isSelected: false, index: 5},
        {value: 'Pacific Islander', isSelected: false, index: 6},
        {value: 'Other', isSelected: false, index: 7},
      ],
      min: 0,
      max: 100,
    };
  }
  componentDidMount = async () => {
    //this.setState({customFilterArray: global.category});
    this.getUserId();
    this.getUserFilterationInformationFromLocalStorage();
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
  };

  getUserFilterationInformationFromLocalStorage = async () => {
    let [gender, radius, location, ageValue, filterList] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.GENDER),
      await commonUtility.getStoreData(Constants.STRING.RADIUS),
      await commonUtility.getStoreData(Constants.STRING.LOCATION_DATA),
      await commonUtility.getStoreData(Constants.STRING.AGE),
      await commonUtility.getStoreData(Constants.STRING.CUSTOM_FILTER_ARRAY),
    ]);
    console.log('ageValue=>', ageValue);
    var ageValueSplitted =
      ageValue != null ? ageValue[0] + '-' + ageValue[1] : '18-30';

    this.setState({
      minimumAgeRange: parseFloat(ageValue[0]),
      maximumAgeRange: parseFloat(ageValue[1]),
      age: ageValueSplitted,
      customFilterArray:
        filterList == null ? this.state.customFilterArray : filterList,
    });

    this.setState({
      gender,
      radius,
      currentLocation: location.locationName,
      currentLatitude: parseFloat(location.currentLatitude),
      currentLongitude: parseFloat(location.currentLongitude),
    });
  };

  customFilteration = async () => {
    const {
      radius,
      age,
      gender,
      currentLocation,
      currentLatitude,
      currentLongitude,
    } = this.state;
    if (userId != null) {
      const formData = new FormData();
      const r = radius.split(' ');
      formData.append(ApiConstants.UID, userId);
      formData.append(ApiConstants.CURRENT_LOCATION, currentLocation);
      formData.append(ApiConstants.LATITUDE, Number(currentLatitude));
      formData.append(ApiConstants.LONGTITUDE, Number(currentLongitude));
      formData.append(ApiConstants.RADIUS, Number(r[0]));
      formData.append(ApiConstants.GENDER_PREFRENCE, gender == 'Male' ? 1 : 2);
      formData.append(ApiConstants.AGE_RANGE, age);
      formData.append(ApiConstants.CUSTOM_FILTER, customFilterArrayData);

      this.props.actions.FilterationTo.filterRequest(
        formData,
        this._onSuccess,
        this._onFailure,
      );
    } else {
      commonUtility.navigateToPleaseLogInfirst(
        this.props,
        Constants.ROUTENAME.SPLASH,
      );
    }
  };

  _onSuccess = async (inheritedData) => {
    var status = inheritedData.status;
    if (status == ApiConstants.SUCCESS) {
      if (this.state.ageSheetOpened) {
        let [ageValue] = await Promise.all([
          await commonUtility.getStoreData(Constants.STRING.AGE),
        ]);
        var ageValueSplitted = ageValue.split('-');
        this.setState({
          minimumAgeRange: parseFloat(ageValueSplitted[0]),
          maximumAgeRange: parseFloat(ageValueSplitted[1]),
          //age: ageValue == null ? '18-30' : ageValue,
        });
      } else {
        this.inflateAlertWindow();
      }
    }
  };

  _onFailure = async (error) => {};

  inflateAlertWindow() {
    setTimeout(() => {
      commonUtility.displayToast('Updated SuccessFully.');
    }, 500);
  }
  handleRadius = async (dataFromProps) => {
    await commonUtility.setStoreData(
      Constants.STRING.RADIUS,
      JSON.stringify(dataFromProps),
    );
    this.setState(
      {
        radius: dataFromProps,
        willShowRadiusRBSheet: false,
      },
      () => {
        this.customFilteration();
      },
    );
  };

  handleGender = async (dataFromProps) => {
    await commonUtility.setStoreData(
      Constants.STRING.GENDER,
      JSON.stringify(dataFromProps),
    );
    this.setState(
      {
        gender: dataFromProps,
        willShowGenderRBSheet: false,
      },
      () => {
        this.customFilteration();
      },
    );
  };

  handleAge = async (dataFromProps) => {
    // console.log('handelagae=>', dataFromProps[0], dataFromProps[0]);
    var finalAge = dataFromProps[0] + `-` + dataFromProps[1];
    console.log('finalAge=>', finalAge);
    await commonUtility
      .setStoreData(Constants.STRING.AGE, JSON.stringify(dataFromProps))
      .then(() => {
        this.setState(
          {
            age: finalAge,
          },
          () => {
            this.customFilteration();
          },
        );
      });
  };
  onAgePress() {
    this.setState(
      {
        ageSheetOpened: true,
        willShowGenderRBSheet: false,
        willShowRadiusRBSheet: false,
      },
      () => {
        this.RBSheet.open();
      },
    );
    // if (Platform.OS === 'ios') {
    //   this.setState(
    //     {
    //       ageSheetOpened: true,
    //       willShowGenderRBSheet: false,
    //       willShowRadiusRBSheet: false,
    //     },
    //     () => {
    //       this.RBSheet.open();
    //     },
    //   );
    // } else {
    //   this.setState(
    //     {
    //       ageSheetOpened: true,
    //       willShowGenderRBSheet: false,
    //       willShowRadiusRBSheet: false,
    //     },
    //     () => {
    //       this.RBSheet.open();
    //     },
    //   );
    //   //commonUtility.displayToast('Error in android platform ');
    // }
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
            // marginTop: heightToDp(5),
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
          style={{
            height: 40,
            width: 40,
          }}></TouchableOpacity>
      </View>
    );
  }

  renderThumb() {
    return (
      <View style={{backgroundColor: 'red', height: 30, width: 70}}></View>
    );
  }
  renderAgeSlider() {
    const {age, minimumAgeRange, maximumAgeRange, min, max} = this.state;
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        closeOnPressBack={true}
        closeOnPressMask={true}
        animationType={'none'}
        height={150}
        customStyles={{
          container: {
            backgroundColor: Constants.COLORS.buttonColor2,
            alignItems: 'center',
            borderRadius: 19,
          },
          draggableIcon: {
            backgroundColor: Constants.COLORS.whiteColor,
          },
        }}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 30,
            marginTop: 20,
            paddingVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 18,
              marginLeft: 0,
              fontFamily: Constants.FONTFAMILY.BOLD,
            }}>
            Age Range
          </Text>
          {/* <Slider
            style={{
              width: 170,
              //height: 40,
              marginLeft: 10,
              backgroundColor: 'yellow',
            }}
            min={10}
            max={100}
            // low={10}
            // high={100}
            //value={age}
            //step={100}
            //allowLabelOverflow={true}
            //disableRange={false}
            // floatingLabel={false}
            //minimumTrackTintColor="#FFFFFF"
            //maximumTrackTintColor="#000000"
            // onValueChanged={
            //   (data) => alert(JSON.stringify(data))
            //   // this.setState({age: parseInt(data)}, () => {
            //   //   this.handleAge(parseInt(data));
            //   // })
            // }
            renderThumb={() => <Thumb />}
            renderRail={() => <Rail />}
            renderRailSelected={() => <RailSelected />}
            renderLabel={(text) => <Label text={text} />}
            renderNotch={() => <Notch />}
          /> */}
          {/* 
          <RangeSlider
            // lineHeight={5}
            style={{width: 170, height: 40, marginLeft: 10}}
            min={18}
            minDistance={4}
            max={99}
            // type={'range'}
            selectedMinimum={minimumAgeRange}
            selectedMaximum={maximumAgeRange}
            // //suffix={10}
            // //step={10}
            // // onChange={(min, max) => console.log(min, max)}
            onChange={(min, max) =>
              this.setState({age: min + '-' + max}, () => {
                this.handleAge(min + '-' + max);
              })
            }
          /> */}
          <MultiSlider
            values={[minimumAgeRange, maximumAgeRange]}
            style={{width: 170, height: 40, marginLeft: 10}}
            sliderLength={170}
            onValuesChange={(value) => this.handleAge(value)}
            min={0}
            max={100}
            //step={1}
            allowOverlap
            snapped
            //customLabel={CustomLabel}
          />

          <Text
            style={{
              color: Constants.COLORS.whiteColor,
              fontSize: 18,
              marginLeft: 0,
              fontFamily: Constants.FONTFAMILY.BOLD,
            }}>
            {age}
          </Text>
        </View>
      </RBSheet>
    );
  }

  setCustomFilterClient = async (value, clickedIndex) => {
    const {customFilterArray} = this.state;
    customFilterArray[clickedIndex].isSelected =
      !customFilterArray[clickedIndex].isSelected;
    this.setState({customFilterArray});
    var filterData = [];
    customFilterArray.map((item, index) => {
      //first filter which one is selected
      if (item.isSelected) {
        filterData.push(item.value);
      }
    });
    customFilterArrayData = filterData;
    await commonUtility.setStoreData(
      Constants.STRING.CUSTOM_FILTER_ARRAY,
      JSON.stringify(this.state.customFilterArray),
    );
    this.customFilteration();
  };

  renderCustomFilterView() {
    return (
      <View style={{backgroundColor: 'transparent', flex: 1}}>
        <FlatList
          data={this.state.customFilterArray}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          renderItem={(item) =>
            this.renderCustomFilterListView(item)
          }></FlatList>
      </View>
    );
  }
  renderCustomFilterListView(item) {
    const {value, isSelected} = item.item;
    // console.log(isSelected);
    return (
      <View
        style={{
          height: 40,
          //backgroundColor: 'white',
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CheckBox
          disabled={false}
          key={item.index}
          value={isSelected}
          onCheckColor={Constants.COLORS.buttonColor2}
          fillColor={Constants.COLORS.buttonColor2}
          tintColor={Constants.COLORS.buttonColor2}
          onTintColor={Constants.COLORS.buttonColor2}
          style={{height: 25, width: 25}}
          onValueChange={(newValue) =>
            this.setCustomFilterClient(newValue, item.index)
          }
        />
        <Text
          style={{
            color: Constants.COLORS.blackColor,
            fontSize: 19,
            fontWeight: '200',
            lineHeight: 20,
            marginLeft: 10,
          }}>
          {value}
        </Text>
      </View>
    );
  }

  render() {
    const {
      willShowRadiusRBSheet,
      willShowGenderRBSheet,
      radius,
      age,
      gender,
      currentLocation,
      ageSheetOpened,
      customFilter,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Statusbar />
        {this.renderHeader()}

        {/* <LoaderComponent isLoading={this.props.isLoading} /> */}

        <BottomSheetView
          animationType="fade"
          closeOnPressBack={true}
          closeOnPressMask={true}
          heading={'Select Preferred Radius'}
          data={['10 miles', '20  miles', '50  miles']}
          handlePress={this.handleRadius}
          height={250}
          willShow={willShowRadiusRBSheet}></BottomSheetView>

        <BottomSheetView
          animationType="fade"
          closeOnPressBack={true}
          closeOnPressMask={true}
          heading={'I am seeking a...'}
          data={['Male', 'Female']}
          handlePress={this.handleGender}
          height={220}
          willShow={willShowGenderRBSheet}
        />

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
              marginTop: heightToDp(0),
              textAlign: 'center',
              fontFamily: Constants.FONTFAMILY.BOLD,
              lineHeight: 35,
            }}>
            {'Filter'}
          </Text>
        </View>
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View
          style={{
            paddingHorizontal: 20,
            height: 55,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.tinyGrey,
              fontSize: 19,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              lineHeight: 20,
            }}>
            {'GENERAL'}
          </Text>
        </View>
        <TouchableOpacity
          // onPress={() =>
          //   this.props.navigation.navigate(Constants.ROUTENAME.NEARME)
          // }
          style={{
            paddingHorizontal: 20,
            height: 55,
            flexDirection: 'row',
            backgroundColor: Constants.COLORS.whiteColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.blackColor,
              fontSize: 19,
              fontWeight: '200',
              lineHeight: 20,
            }}>
            {'Current Location'}
          </Text>
          <Text
            style={{
              color: Constants.COLORS.buttonColor3,
              fontSize: 19,
              fontWeight: '300',
              lineHeight: 20,
            }}>
            {currentLocation}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              willShowRadiusRBSheet: true,
              willShowGenderRBSheet: false,
              ageSheetOpened: false,
            })
          }
          style={{
            paddingHorizontal: 20,
            height: 55,
            flexDirection: 'row',
            backgroundColor: Constants.COLORS.whiteColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.blackColor,
              fontSize: 19,
              fontWeight: '200',
              lineHeight: 20,
            }}>
            {'Search radius'}
          </Text>
          <Text
            style={{
              color: Constants.COLORS.buttonColor3,
              fontSize: 19,
              fontWeight: '300',
              lineHeight: 20,
            }}>
            {radius}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            this.setState({
              willShowGenderRBSheet: true,
              willShowRadiusRBSheet: false,
              ageSheetOpened: false,
            })
          }
          style={{
            paddingHorizontal: 20,
            height: 55,
            flexDirection: 'row',
            backgroundColor: Constants.COLORS.whiteColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.7,
          }}>
          <Text
            style={{
              color: Constants.COLORS.blackColor,
              fontSize: 19,
              fontWeight: '200',
              lineHeight: 20,
            }}>
            {'Gender preference'}
          </Text>
          <Text
            style={{
              color: Constants.COLORS.buttonColor3,
              fontSize: 19,
              fontWeight: '300',
              lineHeight: 20,
            }}>
            {gender}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.onAgePress()}
          style={{
            paddingHorizontal: 20,
            height: 55,
            flexDirection: 'row',
            backgroundColor: Constants.COLORS.whiteColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.blackColor,
              fontSize: 19,
              fontWeight: '200',
              lineHeight: 20,
            }}>
            {'Age Range'}
          </Text>
          <Text
            style={{
              color: Constants.COLORS.buttonColor3,
              fontSize: 19,
              fontWeight: '300',
              lineHeight: 20,
            }}>
            {age}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
            height: 55,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.tinyGrey,
              fontSize: 19,
              fontFamily: Constants.FONTFAMILY.REGULAR,
              lineHeight: 20,
            }}>
            {'ADVANCED'}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            height: 55,
            flexDirection: 'row',
            backgroundColor: Constants.COLORS.whiteColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: Constants.COLORS.seeyouback,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              color: Constants.COLORS.blackColor,
              fontSize: 19,
              fontWeight: '200',
              lineHeight: 20,
            }}>
            {'Custom Filter'}
          </Text>
          <Switch
            trackColor={{false: 'gray', true: Constants.COLORS.buttonColor1}}
            value={this.state.customFilter}
            onValueChange={(customFilter) =>
              this.setState({
                willShowRadiusRBSheet: false,
                willShowGenderRBSheet: false,
                ageSheetOpened: false,
                customFilter,
              })
            }
          />
        </View>
        {customFilter && this.renderCustomFilterView()}
        {/* </ScrollView> */}
        {ageSheetOpened ? this.renderAgeSlider() : null}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state.filterReducer.isLoading,
  userLoginData: state.loginReducer.userData,
  userVerifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
});

//redux function for Filteration
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      FilterationTo: bindActionCreators(FilterAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
