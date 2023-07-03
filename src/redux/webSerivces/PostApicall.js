import ApiConstants from '../../frequent/Utility/ApiConstants';
export const postApiCallFCM = (headerParams, params, url) => {
  return axios
    .create({
      baseURL: ApiConstants.BASE_URL,
      timeout: TIMEOUT,
      headers: headerparams,
    })
    .post(url, params)
    .catch(function (error) {
      return error.response;
    });
};
