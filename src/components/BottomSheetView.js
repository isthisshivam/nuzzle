import Carousel, {Pagination} from 'react-native-snap-carousel';
import React, {Component, useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

import Constants from '../frequent/Constants';
import RBSheet from 'react-native-raw-bottom-sheet';

const BottomSheetView = (props) => {
  const {
    heading,
    selectGender,
    refrence,
    willShow,
    willShowTwoButton,
    data,
    closeOnPressBack,
    closeOnPressMask,
    height,
    animationType,
  } = props;
  //console.log('BottomSheetView', JSON.stringify(props));
  const refRBSheet = useRef();
  useEffect(() => {
    if (willShow) refRBSheet.current.open();
    else refRBSheet.current.close();
  });
  return (
    <>
      <RBSheet
        ref={refRBSheet}
        closeOnPressBack={closeOnPressBack}
        closeOnPressMask={closeOnPressMask}
        animationType={animationType ? animationType : 'none'}
        height={height}
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
            paddingHorizontal: 30,
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 30,
              //justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 17,
                color: Constants.COLORS.dividerDark,
                fontFamily: Constants.FONTFAMILY.REGULAR,
              }}>
              {heading}
            </Text>
          </View>

          <FlatList
            data={data}
            scrollEnabled={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  backgroundColor: '#353a50',
                  width: Constants.DIMESIONS.WINDOWWIDTH / 1.2,
                  marginTop: 10,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                }}
                onPress={() => [
                  props.handlePress(item),
                  console.log('TouchableOpacity========>', item),
                ]}>
                <Text
                  style={{
                    fontSize: Constants.FONTSIZE.BaseFontSize - 3,
                    fontWeight: 'bold',
                    color: Constants.COLORS.whiteColor,
                    fontFamily: Constants.FONTFAMILY.BOLD,
                    marginLeft: 5,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}></FlatList>
        </View>
      </RBSheet>
    </>
  );
};
export default BottomSheetView;
