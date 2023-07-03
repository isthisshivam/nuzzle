import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const requestTime = 50000;

class RequestCreator {
  static async getRequest(url, param) {
    console.log('start >>> ' + 'url >>', url, 'params >', param);

    const instance = axios({
      method: 'POST',
      url: url,
      timeout: requestTime,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      data: param,
    });
    return new Promise(function (resolve, reject) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          instance
            .then(function (response) {
              resolve(response.data);
            })
            .catch(function (error) {
              console.log('Api respoonse error', JSON.stringify(error));

              if (error.response != null) {
                reject(error.response.data);
              } else {
                reject({message: 'oops, Please try after some time.'});
              }
            });
        } else
          reject({
            message: 'Something went wrong, Please try after again some time.',
          });
      });
    });
  }
}

export default RequestCreator;
