import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, StatusbarA} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
import loginReducer from '../../redux/reducers/LoginReducer';
import {connect} from 'react-redux';

class WelcomeSplash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // console.log('DYNAMICS SPLASH', Constants.DIMESIONS.WINDOWWIDTH);
  }

  componentDidMount = () => {
    console.log(
      'login Data==' +
        JSON.stringify(this.props.userLoginData) +
        '---' +
        JSON.stringify(this.props.userVarifyData),
    );

    // Start counting when the page is loaded
    // Add your logic for the transition
    // this.props.navigation.reset(
    //   {
    //     index: 0,
    //     routes: [
    //       {
    //         name:
    //           this.props.userLoginData != undefined ||
    //           this.props.userVarifyData != undefined
    //             ? Constants.ROUTENAME.HOME
    //             : Constants.ROUTENAME.SPLASH,
    //       },
    //     ],
    //   },
    //   5000,
    // );
    setTimeout(() => {
      this.props.navigation.reset({
        index: 0,
        routes: [
          {
            name: Constants.ROUTENAME.HOME,
          },
        ],
      });
    }, 1000);
  };

  componentWillUnmount = () => {
    // clearTimeout(this.timeoutHandle);
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
          <Image
            style={{
              height: 110,
              width: 230,
              resizeMode: 'contain',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center', //  <-- you can use "center", "flex-start",
              marginTop: heightToDp(15),
            }}
            source={ImageCostants.SPLASH.NUZZELWHITETEXT}></Image>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  // loginReducer: state.loginReducer,
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
});

//redux function for login
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeSplash);
