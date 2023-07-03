import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {heightToDp, width, height, widthToDp} from '../frequent/Utility/Utils';
import Constants from '../frequent/Constants';
const Skeletons = ({type}) => {
  return (
    <>
      {type == 'paragraph' ? (
        <SkeletonPlaceholder
          highlightColor={Constants.COLORS.buttonColor4}
          backgroundColor={Constants.COLORS.buttonColor2}
          // speed={1000}
        >
          <SkeletonPlaceholder.Item
            borderRadius={15}
            alignSelf={'center'}
            resizeMode={'contain'}
            height={100}
            marginTop={heightToDp(9)}
            width={
              Constants.DIMESIONS.WIDOWHEIGHT / 2.5
            }></SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ) : null}
      {type == 'cardAvatar' ? (
        <SkeletonPlaceholder
          highlightColor={Constants.COLORS.buttonColor4}
          backgroundColor={Constants.COLORS.buttonColor2}>
          <SkeletonPlaceholder.Item
            borderRadius={15}
            alignSelf={'center'}
            resizeMode={'contain'}
            height={
              Constants.DIMESIONS.WIDOWHEIGHT > 800
                ? Constants.DIMESIONS.WIDOWHEIGHT / 2.2
                : Constants.DIMESIONS.WIDOWHEIGHT / 2.4
            }
            width={
              Constants.DIMESIONS.WIDOWHEIGHT / 3
            }></SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ) : null}
    </>
  );
};

export default Skeletons;
