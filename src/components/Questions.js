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
import {bindActionCreators} from 'redux';
import * as NuzzlePointsAction from '../redux/actions/NuzzlePointsAction';
import CheckBox from '@react-native-community/checkbox';
import {widthToDp, heightToDp} from '../frequent/Utility/Utils';
import {connect} from 'react-redux';
import moment from 'moment';
import commonUtility from '../frequent/Utility/CommonUtility';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImageConstants from '../frequent/ImageConstants';
import Constants from '../frequent/Constants';
import LoaderComponent from './LoaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
// import RadioForm, {
//   RadioButton,
//   RadioButtonInput,
//   RadioButtonLabel,
// } from 'react-native-simple-radio-button';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      question: [
        {
          questions: 'REASON FOR UNMATCHING?',
          type: 'radio',
          answers: [
            'INAPPROPRIATE BEHAVIOUR',
            'BORING CHAT',
            'MISLEADING USER',
            'SOMETHING ELSE',
          ],
          answer_index: [2, 4, 1, 9],
        },
        {
          questions: 'WAS USER INAPPROPRIATE ?',
          type: 'radio',
          answers: ['YES', 'NO'],
          answer_index: [2, 5],
        },
        {
          questions: 'TELL US MORE?',
          type: 'radio',
          answers: [
            'INAPPROPRIATE PICTURE REQUEST',
            'IMMEDIATLY ASKING TO HANG OUT',
            'RUDE',
            'FOUL LANGUAGE',
            'OTHER',
          ],
          answer_index: [3, 3, 3, 3, 9],
        },
        {
          questions: 'WAS THE LANGUAGE?',
          type: 'radio',
          answers: [
            'USED ON OCCASION',
            'JUST NOT WELCOMING',
            'HORRIBLRGROSS',
            'OTHER',
          ],
          answer_index: [4, 4, 4, 9],
        },
        {
          questions: 'WAS MADE IT BORING?',
          type: 'radio',
          answers: [
            'PERSON SEEMS UNINTRESTED',
            'TOO MUCH TIME BETWEEN MESSAGES',
            'JUST NOT ENJOYABLE',
            'OTHER',
          ],
          answer_index: [5, 5, 5, 9],
        },
        {
          questions: 'WHAT WAS MEASLEADING?',
          type: 'radio',
          answers: ['PHOTOS', 'MESSAGES/COMMUNICATION', 'BOI', 'OTHER'],
          answer_index: [6, 9, 7, 9],
        },
        {
          questions: 'PHOTOS?',
          type: 'radio',
          answers: ['MEASLEADING PICTURES', 'NOT ENOUGH PICTURES', 'OTHER'],
          answer_index: [7, 7, 9],
        },
        {
          questions: 'MESSAGES/COMMUNICATION?',
          type: 'radio',
          answers: [
            'VAUGE RESPONSES/WITHHELD INFO',
            'JUST HERE FOR HOOKUPS',
            'SUSPECT DISHONESTY',
            'OTHER',
          ],
          answer_index: [8, 8, 8, 9],
        },
        {
          questions: 'BIO?',
          type: 'radio',
          answers: [
            'INVENTIONS COVERED UP',
            'HERE FOT A HOOKUP',
            'MESSAGES SOUNDED FALSE',
            'OTHER',
          ],
          answer_index: [9, 9, 9, 9],
        },
        {
          questions: 'THANKS YOU! ENJOY 10 FREE POINTS ON US!?',
          type: 'radio',
          answers: [],
        },
      ],
      selectedAnswer: 0,
      selectedIndex: null,
      current: 0,
      correctScore: 5,
      totalScore: 50,
      results: {
        score: 0,
        correctAnswers: 0,
      },
      completed: false,
    };
    console.log('Questions.props', props);
  }

  renderOptions = ({answers, answer_index}, type) => {
    console.log('renderOptions==', JSON.stringify(answers));

    const {selectedAnswer} = this.state;
    //let key2 = `${item.index}-100`;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 14,
          marginLeft: 12,
        }}>
        {/* <RadioButton key={item.index} labelHorizontal={true}>
          <RadioButtonInput
            index={item.index}
            obj={item.item}
            isSelected={item.index === selectedAnswer}
            onPress={(val, label) => {
              // alert(label);
              // clicked = item.index;
              this.setState({selectedAnswer: val});
              console.log(
                'renderOptions.selecteditem==',
                item.index,
                clicked,
                this.state.selectedAnswer,
              );
            }}
            borderWidth={1}
            buttonInnerColor={Constants.COLORS.buttonColor2}
            buttonOuterColor={'black'}
            buttonSize={17}
            buttonOuterSize={22}
            buttonStyle={{}}
            // buttonWrapStyle={{ marginLeft: 10 }}
          />
        </RadioButton> */}
        {/* <RadioForm
          labelStyle={{fontSize: 15, color: 'green'}}
          labelWrapStyle={{
            margin: 20,
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
          }}
          buttonColor={'green'}
          selectedButtonColor={'green'}
          buttonStyle={{
            height: 20,
            width: 20,
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
          }}
          labelColor={'white'}
          // radio_props={
          //   haveClientCode
          //     ? loggedInUserData
          //     : withoutLoggedInUserData
          // }
          radio_props={item[0]}
          style={{
            //height: haveClientCode ? 120 : 80,
            height: 120,
            justifyContent: 'space-between',
          }}
          initial={0}
          onPress={(value) => {
            //setValue(value);
          }}
        /> */}
        {/* <RadioGroup
          // isSelected={selectedAnswer == item.index}
          size={24}
          activeColor={Constants.COLORS.buttonColor2}
          onSelect={
            (index, answer, data) =>
              console.log('selecteddata=', index, answer, data)
            // this.setState({selectedAnswer: index})
          }
          thickness={2}
          selectedIndex={null}> */}
        {answers.map((datataaaa, index) => {
          console.log('itemiredsdsdsd', index);
          return (
            <RadioButton
              // onPress={
              //   (index, answer) => console.log('selecteddata=', index, answer)
              //   // this.setState({selectedAnswer: index})
              // }
              // isSelected={this.state.selectedAnswer != item.index}
              highlightColor={Constants.COLORS.buttonColor2}
              color={Constants.COLORS.buttonColor1}
              value={datataaaa.index}
              index={datataaaa.index}
              key={datataaaa.index}>
              <Text style={{marginLeft: 10}}>{datataaaa}</Text>
            </RadioButton>
          );
        })}
        {/* </RadioGroup> */}
        {/* <Text style={{marginLeft: 10}}>{'item.item.label'}</Text> */}
      </View>
    );
  };
  renderRadioButtons = ({answers, answer_index}) => {
    return answers.map((params, index) => {
      console.log('renderRadioButtons', index);
      return (
        <RadioButton
          //selectedIndex={this.state.selectedIndex}
          highlightColor={Constants.COLORS.buttonColor2}
          color={Constants.COLORS.buttonColor2}
          value={params.index}
          index={params.index}
          key={params.index}>
          <Text
            style={{
              marginLeft: 10,
              letterSpacing: 0.5,
              fontSize: 15,
              fontFamily: Constants.FONTFAMILY.REGULAR,
            }}>
            {params}
          </Text>
        </RadioButton>
      );
    });
  };

  manipulateData = (sIndex) => {
    const {question, current, selectedAnswer} = this.state;
    this.setState({selectedIndex: null});
    console.log(
      'manipulateData.quaestionindexarray==',
      this.state.question[current].answer_index,
    );
    console.log(
      'manipulateData.selectedndex==',
      this.state.question[current].answer_index[sIndex],
    );

    this.setState({
      selectedAnswer: this.state.question[current].answer_index[sIndex],
    });
  };
  onNextPress = async () => {
    console.log(
      'manipulateData.currentindex==',
      this.state.selectedAnswer,
      this.state.selectedIndex,
    );
    await this.setState({selectedIndex: -1}, () => {
      if (this.state.selectedAnswer) {
        setTimeout(() => {
          this.setState(
            {
              current: this.state.selectedAnswer,
            },
            () => {
              // if (this.state.current == 8) {
              //   this.addNuzzlePoints(this.state.selectedAnswer);
              // }
              this.addNuzzlePoints(this.state.selectedAnswer);
            },
          );
        }, 200);
      } else if (this.state.current == 0) {
        commonUtility.displayToast('Please select any option');
      } else {
        this.setState({current: 9}, () => {
          this.addNuzzlePoints(this.state.current);
        });
      }
    });
  };
  addNuzzlePoints = async (index) => {
    if (index == 9) {
      this.addNuzzlePointsToUserProfile();
    }
    console.log('addNuzzlePoints.called', index);
  };
  onSkipPress = () => {
    this.setState(
      {current: this.state.current + 1, selectedIndex: null},
      () => {
        if (this.state.current == 9) {
          this.addNuzzlePointsToUserProfile();
        }
        console.log('addNuzzlePoints.called', this.state.current);
      },
    );
  };
  addNuzzlePointsToUserProfile = async () => {
    const formData = new FormData();
    formData.append('first_uid', this.props?.userId);
    formData.append('first_uid_points', '40');
    formData.append('first_points_type', '1');
    this.props.actions.addNuzzlePoints.nuzzlePointsRequest(
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
    if (responseData) {
      this.props.onComplete();
    }
  };

  onPopUserFailure = async (error) => {
    commonUtility.displayToast(error);
    console.log('nuzzleUpDelete  onPopUserFailure', JSON.stringify(error));
  };
  renderQuestions = (item) => {
    return (
      <View
        style={{
          paddingHorizontal: 0,
          width: '100%',
          height: 250,
        }}>
        <Text
          style={{
            fontSize: 20,
            marginTop: 20,
            marginLeft: 10,
            fontFamily: Constants.FONTFAMILY.BOLD,
          }}>
          {item.questions}
        </Text>
        <RadioGroup
          color={Constants.COLORS.buttonColor2}
          size={24}
          style={{fontSize: 20, marginTop: 20}}
          activeColor={Constants.COLORS.buttonColor2}
          onSelect={(index) => this.manipulateData(index)}
          thickness={3}
          selectedIndex={this.state.selectedIndex}>
          {this.renderRadioButtons(item)}
        </RadioGroup>
      </View>
    );
  };
  render() {
    return (
      <View style={{width: '100%'}}>
        {this.state.question.length > this.state.current &&
          this.renderQuestions(this.state.question[this.state.current])}
        {this.state.current != 9 && (
          <Text
            onPress={() => this.onSkipPress()}
            style={{
              color: Constants.COLORS.buttonColor2,
              fontSize: 17,
              letterSpacing: 0.6,
              top: heightToDp(3),
              textAlign: 'center',
              fontFamily: Constants.FONTFAMILY.REGULAR,
            }}>
            {'SKIP'}
          </Text>
        )}
        {this.state.current != 9 && (
          <TouchableOpacity
            onPress={() => this.onNextPress()}
            style={{
              top: heightToDp(this.state.current == 9 ? 10 : 3),
              bottom: 0,
              left: 0,
              alignSelf: 'center',
              right: 0,
              height: 50,
              borderColor: Constants.COLORS.whiteColor,
              borderWidth: 1,
              width: widthToDp(70),
              backgroundColor: Constants.COLORS.buttonColor2,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: Constants.COLORS.whiteColor,
                fontSize: 17,
                letterSpacing: 0.6,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {'NEXT'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userLoginData: state.loginReducer.userData,
  userVarifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
  nuzzlePointsReducer: state.nuzzlePointsReducer.userData,
  isLoading: state.nuzzlePointsReducer.showLoader,
});

//redux function for edit profile and get profile
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      addNuzzlePoints: bindActionCreators(NuzzlePointsAction, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
