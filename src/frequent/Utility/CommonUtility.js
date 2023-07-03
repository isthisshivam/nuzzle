import React, {Component} from 'react';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
class commonUtility {
  static validateEmail = (email) => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
    );

    return pattern.test(email);
  };
  static navigateToPleaseLogInfirst = (PROPS, ROUTENAME) => {
    PROPS.navigation.navigate(ROUTENAME);
  };
  static displayToast = (messgae) => {
    Toast.show(messgae, Toast.SHORT);
  };
  static delay = (ms) => new Promise((res) => setTimeout(res, ms));
  static setStoreData = async (key_to_be_paired, data_to_store) => {
    try {
      await AsyncStorage.setItem(key_to_be_paired, data_to_store);
    } catch (e) {
      console.log(
        'Error when storing data for following key =>',
        JSON.stringify(key_to_be_paired + e),
      );
    }
  };
  static getStoreData = async (key_to_be_fetched) => {
    try {
      const value = await AsyncStorage.getItem(key_to_be_fetched);
      if (value != null) return JSON.parse(value);
      else return null;
    } catch (e) {
      console.log(
        'Error when getting data for following key =>',
        JSON.stringify(key_to_be_fetched + e),
      );
      return null;
    }
  };
}

export default commonUtility;
