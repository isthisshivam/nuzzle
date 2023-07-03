import * as Api from '../../frequent/Utility/ApiConstants';
import {LoginApiWorker} from '../webSerivces/api_manager/RequestGenerator';

export const sendRequest = async (url, payload) => {
  return await new Promise((resolve, reject) => {
    LoginApiWorker(this, url, payload)
      .then((success) => {
        //console.log('WEBSERVICE respoonse', JSON.stringify(success));
        if (success.status == Api.SUCCESS) {
          resolve(success);
        }
      })
      .catch((error) => {
        console.log('WEBSERVICE Error', JSON.stringify(error));
        reject(error);
      });
  });
};
