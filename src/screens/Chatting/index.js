// import React, {Component} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   Switch,
//   StatusBar,
//   ActivityIndicator,
//   Alert,
//   ImageBackground,
//   KeyboardAvoidingView,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Platform,
// } from 'react-native';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import Constants from '../../frequent/Constants';
// import ImageCostants from '../../frequent/ImageConstants';
// import {heightToDp, Statusbar} from '../../frequent/Utility/Utils';
// import CustomizedButton from '../../components/Button';
// import {FlatList, TextInput} from 'react-native-gesture-handler';
// const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
// import {bindActionCreators} from 'redux';
// import {connect} from 'react-redux';
// import commonUtility from '../../frequent/Utility/CommonUtility';
// ////////////////////////////////////
// import ImageView from 'react-native-image-viewing';
// import firebase from '@react-native-firebase/app';
// import firestore from '@react-native-firebase/firestore';
// import Message from '../../components/Message';
// import auth from '@react-native-firebase/auth';
// import ImagePicker from 'react-native-image-crop-picker';
// import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
// import moment from 'moment';
// import storage from '@react-native-firebase/storage'; // 1
// import LoaderComponent from '../../components/LoaderComponent';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import RecordingButton from '../../components/RecordingButton';
// ///////////////////////////////
// var recordSecs = 0;
// var recordTime = 0;
// var audioRecorderPlayer = new AudioRecorderPlayer();
// const GALLERY = 'GALLERY';
// const CAMERA = 'CAMERA';
// const images = [
//   {
//     uri: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
//   },
//   {
//     uri: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
//   },
//   {
//     uri: 'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
//   },
// ];
// class Chatting extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       message: '',
//       messageArray: [],
//       profile: '',
//       avatarSource: '',
//       anotherUserId: this.props.route.params.id
//         ? this.props.route.params.id
//         : null,
//       anotherUserName: this.props.route.params.name,
//       anotherUserProfile: this.props.route.params.profile_pic,
//       userId: null,
//       senderName: '',
//       senderProfile: '',
//       isRecording: false,
//       isPlaying: false,
//       isLoading: false,
//       isImageViewOpened: false,
//       imageArray: [],
//       activeImageIndex: 0,
//     };
//     this.onRequestImageOpenOrClose = this.onRequestImageOpenOrClose.bind(this);
//   }
//   componentDidMount = async () => {
//     this.getUserId();
//   };
//   componentWillUnmount = async () => {};
//   onStartRecordingPress = async () => {
//     if (Platform.OS === 'android') {
//       commonUtility.displayToast('Error while recording audio ');
//       return;
//     } else {
//       this.setState({isRecording: true});
//       commonUtility.displayToast(
//         'Audio is recording untill you will not press stop button',
//       );
//       const path = Platform.select({
//         ios: this.generateRandomName(7),
//         // android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
//         android: this.generateRandomName(7),
//       });
//       await audioRecorderPlayer.startRecorder(path);
//       audioRecorderPlayer.addRecordBackListener((e) => {
//         recordSecs = e.current_position;
//         recordTime = audioRecorderPlayer.mmssss(Math.floor(e.current_position));
//         console.log(recordTime);
//         return;
//       });
//     }
//   };
//   onStopRecordingPress = async () => {
//     this.setState({isRecording: false});
//     commonUtility.displayToast('Audio recording has stopped.');

//     const result = await audioRecorderPlayer.stopRecorder();
//     audioRecorderPlayer.removeRecordBackListener();
//     recordSecs = 0;
//     const actualFileName = result.split('/').pop();
//     this.uploadFileToFirebaseStorage(result, actualFileName, 'audio');
//   };

//   generateRandomName(length) {
//     var result = '';
//     var characters =
//       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     const path = Platform.select({
//       ios: '.m4a',
//       android: '.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
//     });

//     return result + path;
//   }

//   uploadFileToFirebaseStorage(path, imageName, type) {
//     this.setState({isLoading: true});
//     let reference = storage().ref(imageName);
//     let task = reference.putFile(path);
//     task
//       .then(() => {
//         console.log(`${imageName} has been successfully uploaded.`);
//         let imageRef = firebase.storage().ref('/' + imageName);
//         imageRef
//           .getDownloadURL()
//           .then((url) => {
//             console.log(`${imageName} has been downloaded uploaded.`, url);
//             this.setState({avatarSource: url}, () => {
//               this.pushMessageToFireStore(
//                 this.state.message,
//                 this.state.userId,
//                 type,
//               );
//             });
//           })
//           .catch((e) =>
//             console.log('getting downloadURL of image error => ', e),
//           );
//       })
//       .catch((e) => console.log('uploading image error => ', e));
//   }

//   onPressChooseImageToCapture = (TYPE) => {
//     if (TYPE == CAMERA) {
//       ImagePicker.openCamera({
//         width: 300,
//         height: 400,
//         mediaType: 'photo',
//         cropping: true,
//         compressImageQuality: 0.8,
//       }).then((image) => {
//         this.generateValidImage(image);
//       });
//     } else if (TYPE == GALLERY) {
//       ImagePicker.openPicker({
//         width: 300,
//         height: 400,
//         mediaType: 'photo',
//         cropping: true,
//         compressImageQuality: 0.8,
//       }).then((image) => {
//         this.generateValidImage(image);
//       });
//     }
//   };

//   generateValidImage(data) {
//     const localUri = data.path;
//     const filename = localUri.split('/').pop();
//     let fileType = data.mime;
//     const newData = {
//       uri: localUri,
//       name: filename,
//       type: fileType,
//     };

//     //console.log('IMAGE second =>', newData);
//     this.setState({profile: data.path, avatarSource: newData}, () => {
//       this.uploadFileToFirebaseStorage(localUri, filename, 'image');
//     });
//   }

//   async pushMessageToFireStore(message, id, type) {
//     const {
//       messageArray,
//       userId,
//       anotherUserId,
//       avatarSource,
//       anotherUserProfile,
//       anotherUserName,
//       senderProfile,
//       senderName,
//     } = this.state;
//     var messageToAdd = {
//       message,
//       sender_id: id,
//       receiver_id: anotherUserId,
//       type: type,
//       image: avatarSource,
//       receiver_image: anotherUserProfile,
//       receiver_name: anotherUserName,
//       sender_name: senderName,
//       sender_profile: senderProfile,

//       created_at: moment().format(), ///set current date to firestore
//     };
//     await firebase
//       .firestore()
//       .collection(Constants.STRING.MESSAGES)
//       .doc(this.setOneToOneChat(anotherUserId, userId))
//       .collection(Constants.STRING.MESSAGES_COLLECTION)
//       .add(messageToAdd)
//       .then(() => {
//         messageArray.push(messageToAdd);
//         console.log('pushMessageToFireStore =>', messageToAdd);
//         this.messageInputref.clear();
//         this.setState({message: ''});
//         this.setState({isLoading: false});
//       });
//     ///here pushing latest messageToAdd to doc as field
//     await firebase
//       .firestore()
//       .collection(Constants.STRING.MESSAGES)
//       .doc(this.setOneToOneChat(anotherUserId, userId))
//       .set({LatestMessage: messageToAdd});
//   }

//   async pullMessages() {
//     const {userId, anotherUserId} = this.state;
//     this.setState({isLoading: true});
//     await firebase
//       .firestore()
//       .collection(Constants.STRING.MESSAGES)
//       .doc(this.setOneToOneChat(anotherUserId, userId))
//       .collection(Constants.STRING.MESSAGES_COLLECTION)
//       .orderBy(Constants.STRING.CREATED_AT)
//       .onSnapshot((querySnapshot) => {
//         const refArray = [];
//         querySnapshot.forEach((documentSnapshot) => {
//           refArray.push(documentSnapshot.data());
//         });
//         //modify data as per need
//         let modifiedArrayData = refArray.map((item, index) => {
//           item.isSelected = false;
//           return {...item};
//         });
//         this.setState({messageArray: modifiedArrayData});
//         var imageArray = [];
//         this.state.messageArray.map((item, index) => {
//           var imageUrl = item.image;
//           imageArray.push({uri: imageUrl});
//         });
//         console.log('messageArray', this.state.messageArray);
//         this.setState({imageArray: imageArray, isLoading: false});
//       });
//   }

//   logOutAnonymously = async () => {
//     try {
//       await auth().signOut();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   getUserId() {
//     console.log(JSON.stringify(this.props.userLoginData));
//     const {id, name, profile_pic} =
//       this.props.userLoginData == undefined
//         ? this.props.userRegisterData || this.props.userVerifyData
//         : this.props.userRegisterData || this.props.userLoginData;

//     this.setState(
//       {userId: id, senderName: name, senderProfile: profile_pic},
//       () => {
//         console.log(
//           'userid=>>>' +
//             JSON.stringify(this.state.userId) +
//             'Another userId=>>' +
//             this.state.anotherUserId,
//         );
//         this.pullMessages();
//       },
//     );
//   }

//   //////Function setsup endpoint for one to one chat
//   setOneToOneChat(uid1, uid2) {
//     //Check if user1’s id is less than user2's
//     if (uid1 < uid2) {
//       return uid1 + '_' + uid2;
//     } else {
//       return uid2 + '_' + uid1;
//     }
//   }

//   renderHeader() {
//     return (
//       <View
//         style={{
//           height: 70,
//           flexDirection: Constants.STRING.ROW,
//           //marginTop: heightToDp(0),
//           backgroundColor: Constants.COLORS.buttonColor2,
//           paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
//           alignItems: Constants.STRING.CENTER,
//           //justifyContent: 'center',
//         }}>
//         <TouchableOpacity
//           onPress={() => this.props.navigation.goBack()}
//           style={{
//             height: 40,
//             width: 40,
//             justifyContent: 'center',
//             //marginTop: heightToDp(5),
//             borderRadius: 40 / 2,
//             borderColor: 'gray',
//             borderWidth: 1.5,
//           }}>
//           <ImageBackground
//             style={{height: 20, width: 20, alignSelf: 'center'}}
//             resizeMode="contain"
//             source={ImageCostants.SPLASH.BACKIMG}></ImageBackground>
//         </TouchableOpacity>

//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             //marginTop: heightToDp(5)
//           }}>
//           <ImageBackground
//             style={{height: 30, width: 100, alignSelf: 'center'}}
//             resizeMode="contain"
//             source={ImageCostants.SPLASH.NUZZELGRAYEXT}></ImageBackground>
//         </View>
//         <TouchableOpacity
//           onPress={() =>
//             this.props.navigation.navigate(Constants.ROUTENAME.SETTING)
//           }
//           style={{
//             height: 40,
//             width: 40,
//             justifyContent: 'center',
//             alignItems: 'center',
//             //marginTop: heightToDp(5),
//             // borderRadius: 40 / 2,
//             //borderColor: 'white',
//             //borderWidth: 1,
//           }}>
//           <ImageBackground
//             style={{height: 40, width: 40, alignSelf: 'center'}}
//             resizeMode="contain"
//             source={ImageCostants.NUZZLEUP.SETTING}></ImageBackground>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   onClick = (url, selectedIndex) => {
//     const {messageArray} = this.state;
//     messageArray[selectedIndex].isSelected = !messageArray[selectedIndex]
//       .isSelected;
//     this.forceUpdate();
//     if (messageArray[selectedIndex].isSelected) {
//       this.onStartPlay(url);
//     } else {
//       this.onStopPlay();
//     }
//   };

//   onStartPlay = async (url) => {
//     console.log('onStartPlay');
//     const msg = await audioRecorderPlayer.startPlayer(url);
//     console.log('audioRecorderPlayer', msg);
//     audioRecorderPlayer.addPlayBackListener((e) => {
//       // this.setState({
//       //   currentPositionSec: e.current_position,
//       //   currentDurationSec: e.duration,
//       //   playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
//       //   duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
//       // });
//       console.log(
//         'onStartPlay duration is',
//         audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
//       );
//       return;
//     });
//   };

//   onStopPlay = async () => {
//     console.log('onStopPlay');
//     audioRecorderPlayer.stopPlayer();
//     audioRecorderPlayer.removePlayBackListener();
//   };
//   chooseMode = () => {
//     Alert.alert(
//       'Selection',
//       'Choose From where you want to send Pictures',
//       [
//         {
//           text: 'GALLERY',
//           onPress: () => this.onPressChooseImageToCapture(GALLERY),
//           style: 'cancel',
//         },
//         {
//           text: 'CAMERA',
//           onPress: () => this.onPressChooseImageToCapture(CAMERA),
//         },
//       ],
//       {cancelable: false},
//     );
//   };

//   emptyView() {
//     return (
//       <TouchableOpacity
//         style={{
//           height: Constants.DIMESIONS.WIDOWHEIGHT,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text
//           style={{color: Constants.COLORS.buttonColor2, alignSelf: 'center'}}>
//           No messages yet!
//         </Text>
//         <View
//           style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
//           <Text style={{color: Constants.COLORS.buttonColor2}}>Say Hey!</Text>
//           <Image
//             style={{height: 20, width: 20, marginLeft: 3}}
//             source={ImageCostants.NUZZLEUP.SMILE}></Image>
//         </View>
//       </TouchableOpacity>
//     );
//   }
//   onRequestImageOpenOrClose = (activeImageIndex) => {
//     // alert(activeImageIndex);
//     //return;
//     this.setState({isImageViewOpened: true, activeImageIndex});
//   };

//   handelClick = () => {
//     isImageViewOpened = true;
//   };
//   render() {
//     const {
//       dataArray,
//       messageArray,
//       isImageViewOpened,
//       userId,
//       isRecording,
//       isPlaying,
//       isLoading,
//       imageArray,
//       activeImageIndex,
//     } = this.state;
//     return (
//       <KeyboardAvoidingView
//         style={{
//           flex: 1,
//           flexDirection: 'column',
//           justifyContent: 'center',
//           backgroundColor: Constants.COLORS.whiteColor,
//         }}
//         enabled
//         behavior={Platform.OS === 'ios' ? 'padding' : ''}
//         keyboardVerticalOffset={0}>
//         <Statusbar />
//         {/* {isImageViewOpened && ( */}
//         <ImageView
//           style={{flex: 1}}
//           images={imageArray}
//           imageIndex={activeImageIndex}
//           visible={isImageViewOpened}
//           onRequestClose={() => this.setState({isImageViewOpened: false})}
//         />
//         {/* )} */}
//         {this.renderHeader()}
//         <LoaderComponent isLoading={this.state.isLoading} />

//         <SafeAreaProvider>
//           <AutoScrollFlatList
//             ListEmptyComponent={() => this.emptyView()}
//             extraData={this.state}
//             contentContainerStyle={{paddingVertical: 20}}
//             enabledAutoScrollToEnd
//             ref={this.myFlatListRef}
//             threshold={20}
//             data={messageArray}
//             renderItem={(item) => (
//               <Message
//                 onRequestImageOpenOrClose={this.onRequestImageOpenOrClose}
//                 isImageViewOpened={isImageViewOpened}
//                 receiver_image={item.item.receiver_image}
//                 isPlaying={item.item.isSelected}
//                 onClick={this.onClick}
//                 index={item.index}
//                 userId={this.state.userId}
//                 time={item.item.created_at}
//                 type={item.item.type}
//                 sender_image={item.item.sender_profile}
//                 sender_id={item.item.sender_id}
//                 imageUrl={item.item.image}
//                 side={
//                   item.item.sender_id == this.state.userId ? 'right' : 'left'
//                 }
//                 message={item.item.message}
//               />
//               // <View
//               //   style={{
//               //     // height: 110,
//               //     backgroundColor: 'white',
//               //     marginTop: 20,
//               //     paddingHorizontal: 5,
//               //   }}>
//               //   {item.user_id != this.state.userId ? (
//               //     <View>
//               //       <View
//               //         style={{
//               //           backgroundColor: Constants.COLORS.buttonColor1,
//               //           marginLeft: 50,
//               //           alignSelf: 'flex-end',
//               //           paddingHorizontal: item.item.type == 'text' ? 20 : 3,
//               //           paddingVertical: item.item.type == 'text' ? 15 : 3,
//               //           borderRadius: 12,
//               //         }}>
//               //         {item.item.type == 'text' && (
//               //           <Text
//               //             style={{
//               //               color: Constants.COLORS.whiteColor,
//               //               fontSize: 14,
//               //               fontFamily: Constants.FONTFAMILY.REGULAR,
//               //               marginTop: 0,
//               //             }}>
//               //             {item.item.message}
//               //           </Text>
//               //         )}
//               //         {item.item.type == 'image' && (
//               //           <ImageBackground
//               //             style={{height: 200, width: 200}}
//               //             imageStyle={{borderRadius: 10}}
//               //             resizeMode="cover"
//               //             source={{
//               //               uri: item.item.image,
//               //             }}></ImageBackground>
//               //         )}
//               //         {item.item.type == 'audio' && !item.item.isSelected && (
//               //           <TouchableOpacity
//               //             onPress={() =>
//               //               this.onClick(item.item.image, item.index)
//               //             }>
//               //             <ImageBackground
//               //               style={{height: 50, width: 50}}
//               //               resizeMode="contain"
//               //               source={
//               //                 ImageCostants.NUZZLEUP.PLAY_RECORD
//               //               }></ImageBackground>
//               //           </TouchableOpacity>
//               //         )}
//               //         {item.item.type == 'audio' && item.item.isSelected && (
//               //           <TouchableOpacity
//               //             onPress={() =>
//               //               this.onClick(item.item.image, item.index)
//               //             }>
//               //             <ImageBackground
//               //               style={{height: 50, width: 50}}
//               //               resizeMode="cover"
//               //               imageStyle={{borderRadius: 20}}
//               //               source={
//               //                 ImageCostants.NUZZLEUP.STOP_RECORD
//               //               }></ImageBackground>
//               //           </TouchableOpacity>
//               //         )}
//               //       </View>
//               //       <Text
//               //         style={{
//               //           color: Constants.COLORS.seeyouback,
//               //           fontSize: 14,
//               //           fontFamily: Constants.FONTFAMILY.REGULAR,
//               //           marginTop: 6,
//               //           marginRight: 5,
//               //           alignSelf: 'flex-end',
//               //           //textAlign: 'justify',
//               //           paddingHorizontal: 0,
//               //         }}>
//               //         {moment(item.item.time).format('h:mm: a')}
//               //       </Text>
//               //     </View>
//               //   ) : (
//               //     <View>
//               //       <View style={{flexDirection: 'row'}}>
//               //         <View
//               //           style={{
//               //             marginRight: 100,
//               //             marginLeft: 10,
//               //             paddingHorizontal: item.item.type == 'text' ? 20 : 3,
//               //             paddingVertical: item.item.type == 'text' ? 15 : 3,
//               //             borderRadius: 12,
//               //             backgroundColor: Constants.COLORS.buttonColor3,
//               //           }}>
//               //           {item.item.type == 'text' && (
//               //             <Text
//               //               style={{
//               //                 color: Constants.COLORS.whiteColor,
//               //                 fontSize: 14,
//               //                 fontFamily: Constants.FONTFAMILY.REGULAR,
//               //                 marginTop: 0,
//               //                 textAlign: 'justify',
//               //               }}>
//               //               {item.item.message}
//               //             </Text>
//               //           )}
//               //           {item.item.type == 'image' && (
//               //             <ImageBackground
//               //               style={{height: 200, width: 200}}
//               //               imageStyle={{borderRadius: 10}}
//               //               resizeMode="contain"
//               //               source={{
//               //                 uri: item.item.image,
//               //               }}></ImageBackground>
//               //           )}
//               //           {item.item.type == 'audio' && !item.item.isSelected && (
//               //             <TouchableOpacity
//               //               onPress={() =>
//               //                 this.onClick(item.item.image, item.index)
//               //               }>
//               //               <ImageBackground
//               //                 style={{height: 50, width: 50}}
//               //                 resizeMode="contain"
//               //                 source={
//               //                   ImageCostants.NUZZLEUP.PLAY_RECORD
//               //                 }></ImageBackground>
//               //             </TouchableOpacity>
//               //           )}
//               //           {item.item.type == 'audio' && item.item.isSelected && (
//               //             <TouchableOpacity
//               //               onPress={() =>
//               //                 this.onClick(item.item.image, item.index)
//               //               }>
//               //               <ImageBackground
//               //                 style={{height: 50, width: 50}}
//               //                 resizeMode="cover"
//               //                 imageStyle={{borderRadius: 20}}
//               //                 source={
//               //                   ImageCostants.NUZZLEUP.STOP_RECORD
//               //                 }></ImageBackground>
//               //             </TouchableOpacity>
//               //           )}
//               //         </View>
//               //       </View>
//               //       <Text
//               //         style={{
//               //           color: Constants.COLORS.seeyouback,
//               //           fontSize: 14,
//               //           fontFamily: Constants.FONTFAMILY.REGULAR,
//               //           marginTop: 6,
//               //           marginLeft: 15,
//               //           paddingHorizontal: 20,
//               //           alignSelf: 'flex-start',

//               //           paddingHorizontal: 0,
//               //         }}>
//               //         {moment(item.item.time).format('h:mm: a')}
//               //       </Text>
//               //     </View>
//               //   )}
//               // </View>
//             )}
//             keyExtractor={(item) => item.user_id}
//           />

//           <KeyboardAvoidingView>
//             <View
//               style={{
//                 height: 60,
//                 paddingHorizontal: 10,
//                 borderTopColor: 'gray',
//                 borderTopWidth: 0.5,
//                 flexDirection: 'row',
//                 marginBottom: 10,
//                 backgroundColor: 'white',
//               }}>
//               <TextInput
//                 style={{
//                   height: 60,
//                   flex: 0.8,
//                   paddingHorizontal: 10,
//                 }}
//                 placeholder="Write your message"
//                 ref={(ref) => (this.messageInputref = ref)}
//                 onChangeText={(message) =>
//                   this.setState({message})
//                 }></TextInput>
//               {isRecording ? (
//                 <>
//                   <RecordingButton
//                     isRecording={isRecording}
//                     onClick={this.onStopRecordingPress}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <RecordingButton
//                     isRecording={isRecording}
//                     onClick={this.onStartRecordingPress}
//                   />
//                 </>
//               )}

//               <TouchableOpacity
//                 onPress={() => this.chooseMode()}
//                 style={{
//                   height: 60,
//                   flex: 0.2,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderLeftColor: 'gray',
//                   //borderLeftWidth: 0.5,
//                 }}>
//                 <Image
//                   style={{height: 30, width: 30}}
//                   source={ImageCostants.NUZZLEUP.UPLAOD}></Image>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() =>
//                   this.state.message != ''
//                     ? this.pushMessageToFireStore(
//                         this.state.message,
//                         this.state.userId,
//                         'text',
//                       )
//                     : alert('Please enter message first')
//                 }
//                 style={{
//                   height: 60,
//                   flex: 0.2,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderLeftColor: 'gray',
//                   borderLeftWidth: 0.5,
//                 }}>
//                 <Image
//                   style={{height: 30, width: 30}}
//                   source={ImageCostants.NUZZLEUP.SEND_BUTTON}></Image>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </SafeAreaProvider>
//       </KeyboardAvoidingView>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   userLoginData: state.loginReducer.userData,
//   userVerifyData: state.verificationReducer.userData,
//   userRegisterData: state.registerReducer.userData,
// });

// //redux function to do chat
// const mapDispatchToProps = (dispatch) => {
//   return {
//     actions: {},
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Chatting);

//////////////////
////////////////////
///////////////////
///////////////////
//

///////////////////
///////////////////
///////////////////////
//////////////////////
//////////////////////
//////////////////////
//////////////////////
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  StatusBar,
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../../frequent/Constants';
import ImageCostants from '../../frequent/ImageConstants';
import {heightToDp, Statusbar} from '../../frequent/Utility/Utils';
import CustomizedButton from '../../components/Button';
import {FlatList, TextInput} from 'react-native-gesture-handler';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import commonUtility from '../../frequent/Utility/CommonUtility';
////////////////////////////////////
import ImageView from 'react-native-image-viewing';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import Message from '../../components/Message';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import moment from 'moment';
import storage from '@react-native-firebase/storage'; // 1
import LoaderComponent from '../../components/LoaderComponent';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RecordingButton from '../../components/RecordingButton';
import InformAlertView from '../../components/InformAlertView';
///////////////////////////////
var recordSecs = 0;
var recordTime = 0;
var audioRecorderPlayer = new AudioRecorderPlayer();
const GALLERY = 'GALLERY';
const CAMERA = 'CAMERA';
var messages = [];
const refArray = [];
var listeners = []; // list of listeners
var start = null; // start position of listener
var end = null; // end position of listener
const pageSize = 2;
var fcmToken = null;
var anotherUserFcmToken = null;
var temp_message = '';
const FIREBASE_API_KEY =
  'AAAAwrm_3qA:APA91bF8GMhS36KZ7zhz_6gZlA0kvusoRWd0GbGavbJq5RIrAfyeoeZAOu1ljoYxbeidKURMlPPZ2CHNexan9gheDIT-SAM9OemWn05E187KFPLZMIOIpWC78DyLNGLeJXPJZW3WSkqk';
var FREE_MESSAGES_COUNT = 2;
var messageCount = null;

class Chatting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messageArray: [],
      profile: '',
      avatarSource: '',
      anotherUserId: this.props.route.params.id
        ? this.props.route.params.id
        : null,
      anotherUserName: this.props.route.params.name,
      anotherUserProfile: this.props.route.params.profile_pic,
      userId: null,
      senderName: '',
      senderProfile: '',
      isRecording: false,
      isPlaying: false,
      isLoading: false,
      isImageViewOpened: false,
      imageArray: [],
      activeImageIndex: 0,
      pageNum: 0,
      isImageLoading: false,
      isVisible: false,
      userNameForMatchReq: this.props.route.params.name,
      //  messagesCount: null,
    };
    this.onRequestImageOpenOrClose = this.onRequestImageOpenOrClose.bind(this);
    console.log('propsareonchatingpage==', this.props.route.params);
  }
  componentDidMount = async () => {
    this.getUserId();
    this.getFcmTokenFromLocalStorage();
    this.checkFreeMessagesInformation();
  };
  checkFreeMessagesInformation = async () => {
    let [freeMessagesValue] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.FREE_MESSAGES_COUNT),
    ]);

    if (freeMessagesValue == null) {
      await commonUtility.setStoreData(
        Constants.STRING.FREE_MESSAGES_COUNT,
        JSON.stringify(FREE_MESSAGES_COUNT),
      );
    }
    messageCount = freeMessagesValue;
  };
  checkUserAbleToSendFreeMessageRequest = async (message, userId, type) => {
    //Get free messages count

    let [messagesCount] = await Promise.all([
      commonUtility.getStoreData(Constants.STRING.FREE_MESSAGES_COUNT),
    ]);

    if (messagesCount != 0) {
      messagesCount--;
      await commonUtility.setStoreData(
        Constants.STRING.FREE_MESSAGES_COUNT,
        JSON.stringify(messagesCount),
      );
      messageCount = messagesCount;
      this.pushMessageToFireStore(message, userId, type);
    } else {
      // alert(messageCount);
      this.setState({isVisible: true});
      //alert(messageCount);
    }
  };
  getFcmTokenFromLocalStorage = async () => {
    let [fcmTokeValue] = await Promise.all([
      await commonUtility.getStoreData(Constants.STRING.FCM_TOKEN),
    ]);
    fcmToken = fcmTokeValue;
    this.setUserTokenToFirebase(fcmToken);
  };

  setUserTokenToFirebase = async (fcmToken) => {
    const {anotherUserId, userId} = this.state;

    var tokenToStore = {
      fcmToken: fcmToken,
    };

    await firebase
      .firestore()
      .collection(Constants.STRING.TOKEN)
      .doc(anotherUserId)
      .set({TOKEN: tokenToStore});
    this.getUserFirebaseTokenFromFireStore();
  };

  getUserFirebaseTokenFromFireStore = async () => {
    const {anotherUserId, userId} = this.state;
    ///working code  for listing data and chats
    await firebase
      .firestore()
      .collection(Constants.STRING.TOKEN)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          var id = documentSnapshot.id;
          var isUserIncludes = id.includes(anotherUserId);
          if (isUserIncludes) {
            var fcmToken = documentSnapshot.data().TOKEN.fcmToken;
            anotherUserFcmToken = fcmToken;
          }
        });
      });
    // alert(anotherUserFcmToken);
  };

  async checkPermission() {
    try {
      await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
        {
          title: 'Microphone Permission',
          message:
            'Enter the Gunbook needs access to your microphone so you can search with voice.',
        },
      );
    } catch (error) {
      console.error('failed getting permission, result:', result);
    }
  }

  onStartRecordingPress = async () => {
    if (Platform.OS === 'android') {
      await this.checkPermission();
      this.setState({isRecording: true});
      commonUtility.displayToast(
        'Audio is recording untill you will not press stop button',
      );
      //   const file = new File('sasass.mp4');
      const path = Platform.select({
        ios: this.generateRandomName(7),
        android: 'sdcard/' + this.generateRandomName(7), // should give extra dir name in android. Won't grant permission to the first level of dir.
        //android: new File(this.generateRandomName(7)),
      });
      await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        recordSecs = e.current_position;
        recordTime = audioRecorderPlayer.mmssss(Math.floor(e.current_position));
        console.log(recordTime);
        return;
      });
      // commonUtility.displayToast('Error while recording audio ');
    } else {
      this.setState({isRecording: true});
      commonUtility.displayToast(
        'Audio is recording untill you will not press stop button',
      );
      const path = Platform.select({
        ios: this.generateRandomName(7),
        // android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
        android: this.generateRandomName(7),
      });
      await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        recordSecs = e.current_position;
        recordTime = audioRecorderPlayer.mmssss(Math.floor(e.current_position));
        console.log(recordTime);
        return;
      });
    }
  };
  onStopRecordingPress = async () => {
    this.setState({isRecording: false});
    commonUtility.displayToast('Audio recording has stopped.');
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    recordSecs = 0;
    const actualFileName = result.split('/').pop();
    this.uploadFileToFirebaseStorage(result, actualFileName, 'audio');
  };

  generateRandomName(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const path = Platform.select({
      ios: '.m4a',
      android: '.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });

    return result + path;
  }

  uploadFileToFirebaseStorage(path, imageName, type) {
    this.setState({isImageLoading: true});
    let reference = storage().ref(imageName);
    let task = reference.putFile(path);
    task
      .then(() => {
        console.log(`${imageName} has been successfully uploaded.`);
        let imageRef = firebase.storage().ref('/' + imageName);
        imageRef
          .getDownloadURL()
          .then((url) => {
            console.log(`${imageName} has been downloaded uploaded.`, url);
            this.setState({avatarSource: url}, () => {
              this.checkUserAbleToSendFreeMessageRequest(
                this.state.message,
                this.state.userId,
                type,
              );
              // this.pushMessageToFireStore(
              //   this.state.message,
              //   this.state.userId,
              //   type,
              // );
            });
          })
          .catch((e) =>
            console.log('getting downloadURL of image error => ', e),
          );
      })
      .catch((e) => console.log('uploading image error => ', e));
  }

  onPressChooseImageToCapture = (TYPE) => {
    if (TYPE == CAMERA) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      }).then((image) => {
        this.generateValidImage(image);
      });
    } else if (TYPE == GALLERY) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      }).then((image) => {
        this.generateValidImage(image);
      });
    }
  };

  generateValidImage(data) {
    const {messageArray} = this.state;
    const localUri = data.path;
    const filename = localUri.split('/').pop();
    let fileType = data.mime;
    const newData = {
      uri: localUri,
      name: filename,
      type: fileType,
    };

    //console.log('IMAGE second =>', newData);
    this.setState({profile: data.path, avatarSource: newData}, () => {
      var obj = {
        sender_id: this.state.userId,
        type: 'image',
        mode: 'local',
        image: this.state.profile,
        created_at: moment().format(), ///set current date to firestore
      };
      messageArray.push(obj);
      this.setState({messageArray: messageArray});

      this.uploadFileToFirebaseStorage(localUri, filename, 'image');
    });
  }

  async pushMessageToFireStore(message, id, type) {
    const {
      messageArray,
      userId,
      anotherUserId,
      avatarSource,
      anotherUserProfile,
      anotherUserName,
      senderProfile,
      senderName,
      mySentMessages,
      another_user_fcm_tkn,
    } = this.state;
    // const route = this?.props?.route?.params?.route;
    var messageToAdd = {
      message,
      sender_id: id,
      receiver_id: anotherUserId,
      type: type,
      image: avatarSource,
      receiver_image: anotherUserProfile,
      receiver_name: anotherUserName,
      sender_name: senderName,
      sender_profile: senderProfile,
      created_at: moment().format(), ///set current date to firestore
      another_user_fcm_tkn: this?.props?.route?.params?.another_user_fcm_tkn,
    };

    var messageToAddToFireStore = {
      message,
      sender_id: id,
      receiver_id: anotherUserId,
      type: type,
      image: avatarSource,
      receiver_image: anotherUserProfile,
      receiver_name: anotherUserName,
      sender_name: senderName,
      sender_profile: senderProfile,
      created_at: moment().format(), ///set current date to firestore
      another_user_fcm_tkn: this?.props?.route?.params?.another_user_fcm_tkn,
    };
    await firebase
      .firestore()
      .collection(Constants.STRING.MESSAGES)
      .doc(this.setOneToOneChat(anotherUserId, userId))
      .collection(Constants.STRING.MESSAGES_COLLECTION)
      .add(messageToAddToFireStore)
      .then(() => {
        messageArray.push(messageToAdd);
        this.messageInputref.clear();
        this.setState({message: ''});
        this.setState({isImageLoading: false}, () => {
          this.sendPushNotification();
        });
      });
    ///here pushing latest messageToAdd to doc as field
    await firebase
      .firestore()
      .collection(Constants.STRING.MESSAGES)
      .doc(this.setOneToOneChat(anotherUserId, userId))
      .set({LatestMessage: messageToAdd});
  }
  sendPushNotification = async () => {
    const messageData = {
      registration_ids: [this?.props?.route?.params?.another_user_fcm_tkn],
      notification: {
        body: temp_message,
        title: this.state.anotherUserName + ` Sent a message.`,
        action: 'Chat',
        sound: 'ring_bell',
        android_channel_id: 'NUZZLE',
      },
      data: {
        body: temp_message,
        title: this.state.anotherUserName + ` Text you.`,
        action: 'Chat',
        anotherUserName: this.state.anotherUserName,
        anotherUserId: this.state.anotherUserId,
        anotherUserProfile: this.state.anotherUserProfile,
        anotherUserFcmToken: this.state.anotherUserFcmToken,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });

    console.log('sendPushNotification.message=>', messageData);
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(messageData),
    });
    response = await response.json();
    console.log('sendPushNotification=>', response);
  };

  async pullMessages() {
    const {userId, anotherUserId} = this.state;
    this.setState({isLoading: true});
    await firebase
      .firestore()
      .collection(Constants.STRING.MESSAGES)
      .doc(this.setOneToOneChat(anotherUserId, userId))
      .collection(Constants.STRING.MESSAGES_COLLECTION)
      .orderBy(Constants.STRING.CREATED_AT)
      // .startAt(this.state.pageNum * pageSize) // here we set start point
      //.limit(pageSize)
      .onSnapshot((querySnapshot) => {
        //////////from here
        //this.setState({pageNum: this.state.pageNum + 1});
        const refArray = [];
        querySnapshot.forEach((documentSnapshot) => {
          console.log('documentSnapshot', documentSnapshot);
          refArray.push(documentSnapshot.data());
        });
        //modify data as per need
        let modifiedArrayData = refArray.map((item, index) => {
          item.isSelected = false;
          return {...item};
        });
        this.setState({messageArray: modifiedArrayData});
        var imageArray = [];
        this.state.messageArray.map((item, index) => {
          var imageUrl = item.image;
          imageArray.push({uri: imageUrl});
        });
        console.log('messageArray', this.state.messageArray);
        this.setState({imageArray: imageArray, isLoading: false});
      });
  }

  ///when was trying to implement pagination///////////
  // async pullMessages() {
  //   const {userId, anotherUserId} = this.state;
  //   this.setState({isLoading: true});
  //   let ref = await firebase
  //     .firestore()
  //     .collection(Constants.STRING.MESSAGES)
  //     .doc(this.setOneToOneChat(anotherUserId, userId))
  //     .collection(Constants.STRING.MESSAGES_COLLECTION);

  //   ref
  //     .orderBy(Constants.STRING.CREATED_AT, 'desc')
  //     .limit(5)
  //     .get()
  //     .then((snapshots) => {
  //       start = snapshots.docs[snapshots.docs.length - 1];
  //       // create listener using startAt snapshot (starting boundary)
  //       let listener = ref
  //         .orderBy(Constants.STRING.CREATED_AT)
  //         .startAt(start)
  //         .onSnapshot((querySnapshot) => {
  //           //////////from here

  //           querySnapshot.forEach((documentSnapshot) => {
  //             console.log('documentSnapshot', documentSnapshot);
  //             refArray.push(documentSnapshot.data());
  //           });
  //           //modify data as per need
  //           let modifiedArrayData = refArray.map((item, index) => {
  //             item.isSelected = false;
  //             return {...item};
  //           });
  //           this.setState({messageArray: modifiedArrayData});
  //           var imageArray = [];
  //           this.state.messageArray.map((item, index) => {
  //             var imageUrl = item.image;
  //             imageArray.push({uri: imageUrl});
  //           });
  //           console.log('messageArray', this.state.messageArray);
  //           this.setState({imageArray: imageArray, isLoading: false});
  //         });
  //       // add listener to list
  //       listeners.push(listener);
  //     });
  //   setTimeout(() => {
  //     this.getMoreMessages();
  //   }, 4000);
  // }
  // getMoreMessages = async () => {
  //   const {userId, anotherUserId} = this.state;
  //   let ref = await firebase
  //     .firestore()
  //     .collection(Constants.STRING.MESSAGES)
  //     .doc(this.setOneToOneChat(anotherUserId, userId))
  //     .collection(Constants.STRING.MESSAGES_COLLECTION);

  //   // single query to get new startAt snapshot
  //   ref
  //     .orderBy(Constants.STRING.CREATED_AT, 'desc')
  //     .startAt(start)
  //     .limit(5)
  //     .get()
  //     .then((snapshots) => {
  //       // previous starting boundary becomes new ending boundary
  //       end = start;
  //       start = snapshots.docs[snapshots.docs.length - 1];
  //       // create another listener using new boundaries
  //       let listener = ref
  //         .orderBy(Constants.STRING.CREATED_AT)
  //         .startAt(start)
  //         .endBefore(end)
  //         .onSnapshot((querySnapshot) => {
  //           //////////from here
  //           //const refArray = [];
  //           querySnapshot.forEach((documentSnapshot) => {
  //             console.log('documentSnapshot', documentSnapshot);
  //             refArray.push(documentSnapshot.data());
  //           });
  //           //modify data as per need
  //           let modifiedArrayData = refArray.map((item, index) => {
  //             item.isSelected = false;
  //             return {...item};
  //           });
  //           this.setState({messageArray: modifiedArrayData});
  //           var imageArray = [];
  //           this.state.messageArray.map((item, index) => {
  //             var imageUrl = item.image;
  //             imageArray.push({uri: imageUrl});
  //           });
  //           console.log('messageArray', this.state.messageArray);
  //           this.setState({imageArray: imageArray, isLoading: false});
  //         });
  //       listeners.push(listener);
  //     });
  // };

  logOutAnonymously = async () => {
    try {
      await auth().signOut();
    } catch (e) {
      console.error(e);
    }
  };

  getUserId() {
    console.log(JSON.stringify(this.props.userLoginData));
    const {id, name, profile_pic} =
      this.props.userLoginData == undefined
        ? this.props.userRegisterData || this.props.userVerifyData
        : this.props.userRegisterData || this.props.userLoginData;

    this.setState(
      {userId: id, senderName: name, senderProfile: profile_pic},
      () => {
        console.log(
          'userid=>>>' +
            JSON.stringify(this.state.userId) +
            'Another userId=>>' +
            this.state.anotherUserId,
        );
        this.pullMessages();
      },
    );
  }

  //////Function setsup endpoint for one to one chat
  setOneToOneChat(uid1, uid2) {
    //Check if user1’s id is less than user2's
    if (uid1 < uid2) {
      return uid1 + '_' + uid2;
    } else {
      return uid2 + '_' + uid1;
    }
  }

  renderHeader() {
    return (
      <View
        style={{
          height: 70,
          flexDirection: Constants.STRING.ROW,
          //marginTop: heightToDp(0),
          backgroundColor: Constants.COLORS.buttonColor2,
          paddingHorizontal: Constants.HEIGHTWIDTH.BASEHEIGHT,
          alignItems: Constants.STRING.CENTER,
          //justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => [
            this.props.navigation.goBack(),
            (global.surveyQuestionrateVisible = true),
          ]}
          // onPress={() =>
          //   this.props.navigation.navigate('Chat', {isVisible: true})
          // }
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            //marginTop: heightToDp(5),
            borderRadius: 40 / 2,
            borderColor: 'gray',
            borderWidth: 1.5,
          }}>
          <ImageBackground
            style={{height: 20, width: 20, alignSelf: 'center'}}
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

  onClick = (url, selectedIndex) => {
    const {messageArray} = this.state;
    messageArray[selectedIndex].isSelected =
      !messageArray[selectedIndex].isSelected;
    this.forceUpdate();
    if (messageArray[selectedIndex].isSelected) {
      this.onStartPlay(url);
    } else {
      this.onStopPlay();
    }
  };

  onStartPlay = async (url) => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer(url);
    console.log('audioRecorderPlayer', msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      // this.setState({
      //   currentPositionSec: e.current_position,
      //   currentDurationSec: e.duration,
      //   playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      //   duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      // });
      console.log(
        'onStartPlay duration is',
        audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      );
      return;
    });
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
  chooseMode = () => {
    Alert.alert(
      'Selection',
      'Choose From where you want to send Pictures',
      [
        {
          text: 'GALLERY',
          onPress: () => this.onPressChooseImageToCapture(GALLERY),
          style: 'cancel',
        },
        {
          text: 'CAMERA',
          onPress: () => this.onPressChooseImageToCapture(CAMERA),
        },
      ],
      {cancelable: false},
    );
  };

  emptyView() {
    return (
      <TouchableOpacity
        style={{
          height: Constants.DIMESIONS.WIDOWHEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{color: Constants.COLORS.buttonColor2, alignSelf: 'center'}}>
          No messages yet!
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <Text style={{color: Constants.COLORS.buttonColor2}}>Say Hey!</Text>
          <Image
            style={{height: 20, width: 20, marginLeft: 3}}
            source={ImageCostants.NUZZLEUP.SMILE}></Image>
        </View>
      </TouchableOpacity>
    );
  }
  onRequestImageOpenOrClose = (activeImageIndex) => {
    this.setState({isImageViewOpened: true, activeImageIndex});
  };

  handelClick = () => {
    isImageViewOpened = true;
  };
  onAnotherUserImageClick = async (sender_id) => {
    this.props.navigation.navigate(Constants.ROUTENAME.PROFILE, {
      id: sender_id,
    });
  };

  onBackdropPress() {
    this.setState({isVisible: false});
  }
  onRequestClose() {
    this.setState({isVisible: false});
  }
  onAccepted() {
    this.setState({isVisible: false});
  }
  //  sendMessageNotification = async () => {
  //   let payload = {
  //     registration_ids: [props?.route?.params?.runnerFcmTkn],
  //     // aps: {
  //     //   'content-available': true,
  //     // },
  //     notification: {
  //       body: message,
  //       title: props?.route?.params?.userName + ` Sent a message.`,
  //       action: "Chat",
  //     },
  //     data: {
  //       body: message,
  //       title: props?.route?.params?.userName + ` Text you.`,
  //       action: "Chat",
  //       runnerId: props?.route?.params?.runnerId,
  //       customerId: props?.route?.params?.customerId,
  //       orderId: props?.route?.params?.orderId,
  //       userName: props?.route?.params?.userName,
  //     },
  //   };

  //   const instance = axios({
  //     method: "POST",
  //     url: SEND_MESSAGE_NOTIFICATION,
  //     timeout: 50000,
  //     headers: {
  //       Authorization:
  //         "key=AAAA6-CGlH4:APA91bHNu5Ir_1aLCEzH5vIyzs7-IWkkWWbcrjModbu9euTIc9ShRjpCf8wMgYNFkLTRCtxgU6W0vUiv0DNwoTCKvNqiNZzLtoI6kVexmuBR4hosBjOaBngdN1LXN9_ymtIqN_-CLUi0",
  //       "Content-Type": "application/json",
  //     },
  //     data: payload,
  //   });

  //   return new Promise(function (resolve, reject) {
  //     instance
  //       .then(function (response) {
  //         //console.log("Api response success", JSON.stringify(response.data));
  //         console.log("sendMsgNotificationRequest.success>>>>", response?.data);
  //       })
  //       .catch(function (error) {
  //         console.log("sendMsgNotificationRequest.failure>>>>", error);
  //       });
  //   });
  // };
  render() {
    const {
      dataArray,
      messageArray,
      isImageViewOpened,
      userId,
      isRecording,
      isPlaying,
      isLoading,
      imageArray,
      activeImageIndex,
      isImageLoading,
      avatarSource,
      profile,
      isVisible,
      userNameForMatchReq,
    } = this.state;
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: Constants.COLORS.whiteColor,
        }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        keyboardVerticalOffset={0}>
        <Statusbar />
        {isVisible && (
          <InformAlertView
            borderColor={'white'}
            backgroundColor={Constants.COLORS.greyLight}
            textHeadingOne={'You have used your two free messages with'}
            textHeadingTwo={'Sending this will message  cost '}
            name={' ' + userNameForMatchReq + '.'}
            points={'-40'}
            nuzzlesText={' nuzzles.'}
            earningPoints={40}
            willButtonVisible={true}
            textHeadingThirdVisible={true}
            onAccepted={() => this.onAccepted()}
            onRequestClose={() => this.onRequestClose()}
            onBackdropPress={() => this.onBackdropPress()}
            isVisible={isVisible}></InformAlertView>
        )}

        {/* {isImageViewOpened && ( */}
        <ImageView
          style={{flex: 1}}
          images={imageArray}
          imageIndex={activeImageIndex}
          visible={isImageViewOpened}
          onRequestClose={() => this.setState({isImageViewOpened: false})}
        />
        {/* )} */}
        {this.renderHeader()}
        <LoaderComponent isLoading={this.state.isLoading} />

        <SafeAreaProvider>
          <AutoScrollFlatList
            ListEmptyComponent={() => this.emptyView()}
            extraData={this.state}
            contentContainerStyle={{paddingVertical: 20}}
            enabledAutoScrollToEnd
            ref={this.myFlatListRef}
            threshold={20}
            data={messageArray}
            renderItem={(item) => (
              console.log('message is ', item.item),
              (
                <Message
                  mode={typeof item.item.mode == 'undefined'}
                  forSendingImage={item.item.forSendingImage}
                  onAnotherUserImageClick={this.onAnotherUserImageClick}
                  onRequestImageOpenOrClose={this.onRequestImageOpenOrClose}
                  isImageViewOpened={isImageViewOpened}
                  receiver_image={item.item.receiver_image}
                  isPlaying={item.item.isSelected}
                  onClick={this.onClick}
                  index={item.index}
                  loadingIndex={messageArray.length + 1}
                  loadingImageUrl={profile}
                  isLoading={isImageLoading}
                  userId={this.state.userId}
                  time={item.item.created_at}
                  type={item.item.type}
                  sender_image={item.item.sender_profile}
                  sender_id={item.item.sender_id}
                  imageUrl={item.item.image}
                  side={
                    item.item.sender_id == this.state.userId ? 'right' : 'left'
                  }
                  message={item.item.message}
                />
              )
              // <View
              //   style={{
              //     // height: 110,
              //     backgroundColor: 'white',
              //     marginTop: 20,
              //     paddingHorizontal: 5,
              //   }}>
              //   {item.user_id != this.state.userId ? (
              //     <View>
              //       <View
              //         style={{
              //           backgroundColor: Constants.COLORS.buttonColor1,
              //           marginLeft: 50,
              //           alignSelf: 'flex-end',
              //           paddingHorizontal: item.item.type == 'text' ? 20 : 3,
              //           paddingVertical: item.item.type == 'text' ? 15 : 3,
              //           borderRadius: 12,
              //         }}>
              //         {item.item.type == 'text' && (
              //           <Text
              //             style={{
              //               color: Constants.COLORS.whiteColor,
              //               fontSize: 14,
              //               fontFamily: Constants.FONTFAMILY.REGULAR,
              //               marginTop: 0,
              //             }}>
              //             {item.item.message}
              //           </Text>
              //         )}
              //         {item.item.type == 'image' && (
              //           <ImageBackground
              //             style={{height: 200, width: 200}}
              //             imageStyle={{borderRadius: 10}}
              //             resizeMode="cover"
              //             source={{
              //               uri: item.item.image,
              //             }}></ImageBackground>
              //         )}
              //         {item.item.type == 'audio' && !item.item.isSelected && (
              //           <TouchableOpacity
              //             onPress={() =>
              //               this.onClick(item.item.image, item.index)
              //             }>
              //             <ImageBackground
              //               style={{height: 50, width: 50}}
              //               resizeMode="contain"
              //               source={
              //                 ImageCostants.NUZZLEUP.PLAY_RECORD
              //               }></ImageBackground>
              //           </TouchableOpacity>
              //         )}
              //         {item.item.type == 'audio' && item.item.isSelected && (
              //           <TouchableOpacity
              //             onPress={() =>
              //               this.onClick(item.item.image, item.index)
              //             }>
              //             <ImageBackground
              //               style={{height: 50, width: 50}}
              //               resizeMode="cover"
              //               imageStyle={{borderRadius: 20}}
              //               source={
              //                 ImageCostants.NUZZLEUP.STOP_RECORD
              //               }></ImageBackground>
              //           </TouchableOpacity>
              //         )}
              //       </View>
              //       <Text
              //         style={{
              //           color: Constants.COLORS.seeyouback,
              //           fontSize: 14,
              //           fontFamily: Constants.FONTFAMILY.REGULAR,
              //           marginTop: 6,
              //           marginRight: 5,
              //           alignSelf: 'flex-end',
              //           //textAlign: 'justify',
              //           paddingHorizontal: 0,
              //         }}>
              //         {moment(item.item.time).format('h:mm: a')}
              //       </Text>
              //     </View>
              //   ) : (
              //     <View>
              //       <View style={{flexDirection: 'row'}}>
              //         <View
              //           style={{
              //             marginRight: 100,
              //             marginLeft: 10,
              //             paddingHorizontal: item.item.type == 'text' ? 20 : 3,
              //             paddingVertical: item.item.type == 'text' ? 15 : 3,
              //             borderRadius: 12,
              //             backgroundColor: Constants.COLORS.buttonColor3,
              //           }}>
              //           {item.item.type == 'text' && (
              //             <Text
              //               style={{
              //                 color: Constants.COLORS.whiteColor,
              //                 fontSize: 14,
              //                 fontFamily: Constants.FONTFAMILY.REGULAR,
              //                 marginTop: 0,
              //                 textAlign: 'justify',
              //               }}>
              //               {item.item.message}
              //             </Text>
              //           )}
              //           {item.item.type == 'image' && (
              //             <ImageBackground
              //               style={{height: 200, width: 200}}
              //               imageStyle={{borderRadius: 10}}
              //               resizeMode="contain"
              //               source={{
              //                 uri: item.item.image,
              //               }}></ImageBackground>
              //           )}
              //           {item.item.type == 'audio' && !item.item.isSelected && (
              //             <TouchableOpacity
              //               onPress={() =>
              //                 this.onClick(item.item.image, item.index)
              //               }>
              //               <ImageBackground
              //                 style={{height: 50, width: 50}}
              //                 resizeMode="contain"
              //                 source={
              //                   ImageCostants.NUZZLEUP.PLAY_RECORD
              //                 }></ImageBackground>
              //             </TouchableOpacity>
              //           )}
              //           {item.item.type == 'audio' && item.item.isSelected && (
              //             <TouchableOpacity
              //               onPress={() =>
              //                 this.onClick(item.item.image, item.index)
              //               }>
              //               <ImageBackground
              //                 style={{height: 50, width: 50}}
              //                 resizeMode="cover"
              //                 imageStyle={{borderRadius: 20}}
              //                 source={
              //                   ImageCostants.NUZZLEUP.STOP_RECORD
              //                 }></ImageBackground>
              //             </TouchableOpacity>
              //           )}
              //         </View>
              //       </View>
              //       <Text
              //         style={{
              //           color: Constants.COLORS.seeyouback,
              //           fontSize: 14,
              //           fontFamily: Constants.FONTFAMILY.REGULAR,
              //           marginTop: 6,
              //           marginLeft: 15,
              //           paddingHorizontal: 20,
              //           alignSelf: 'flex-start',

              //           paddingHorizontal: 0,
              //         }}>
              //         {moment(item.item.time).format('h:mm: a')}
              //       </Text>
              //     </View>
              //   )}
              // </View>
            )}
            keyExtractor={(item) => item.user_id}
          />

          <KeyboardAvoidingView>
            <View
              style={{
                height: 60,
                paddingHorizontal: 10,
                borderTopColor: 'gray',
                borderTopWidth: 0.5,
                flexDirection: 'row',
                marginBottom: 10,
                backgroundColor: 'white',
              }}>
              <TextInput
                style={{
                  height: 60,
                  flex: 0.8,
                  paddingHorizontal: 10,
                }}
                placeholder="Write your message"
                ref={(ref) => (this.messageInputref = ref)}
                onChangeText={(message) => [
                  (temp_message = message),
                  this.setState({message}),
                ]}></TextInput>
              {messageCount != null && messageCount == 0 ? (
                <>
                  {isRecording ? (
                    <>
                      <RecordingButton
                        isRecording={isRecording}
                        onClick={this.onStopRecordingPress}
                      />
                    </>
                  ) : (
                    <>
                      <RecordingButton
                        isRecording={isRecording}
                        onClick={this.onStartRecordingPress}
                      />
                    </>
                  )}

                  <TouchableOpacity
                    onPress={() => this.chooseMode()}
                    style={{
                      height: 60,
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderLeftColor: 'gray',
                      //borderLeftWidth: 0.5,
                    }}>
                    <Image
                      style={{height: 30, width: 30}}
                      source={ImageCostants.NUZZLEUP.UPLAOD}></Image>
                  </TouchableOpacity>
                </>
              ) : null}

              <TouchableOpacity
                onPress={() =>
                  this.state.message != ''
                    ? this.checkUserAbleToSendFreeMessageRequest(
                        this.state.message,
                        this.state.userId,
                        'text',
                      )
                    : // this.pushMessageToFireStore(
                      //     this.state.message,
                      //     this.state.userId,
                      //     'text',
                      //   )

                      alert('Please enter message first')
                }
                style={{
                  height: 60,
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeftColor: 'gray',
                  borderLeftWidth: 0.5,
                }}>
                <Image
                  style={{height: 30, width: 30}}
                  source={ImageCostants.NUZZLEUP.SEND_BUTTON}></Image>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => ({
  userLoginData: state.loginReducer.userData,
  userVerifyData: state.verificationReducer.userData,
  userRegisterData: state.registerReducer.userData,
});

//redux function to do chat
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chatting);
