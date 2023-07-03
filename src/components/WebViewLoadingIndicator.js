import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native-paper';

const WebViewLoader = () => {
  return (
    <ActivityIndicator
      color="pink"
      size="small"
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: -150,
        bottom: 0,
      }}
    />
  );
};

export default WebViewLoader;
