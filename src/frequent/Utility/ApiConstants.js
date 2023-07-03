/**
 * @URL Basic URLS for Api's and Images etc
 */
export const BASE_URL = 'http://rapidsofts.com/nuzzle/backend/web/api/';
//export const BASE_URL = 'http://3.141.222.59/nuzzle/backend/web/api/';
/**
 * @ENDPOINTS
 */
export const LOGIN = BASE_URL + 'login';
export const SIGNUP = BASE_URL + 'usercreate';
export const VERIFY_CODE = BASE_URL + 'verifycode';
export const HOME = BASE_URL + 'home';
export const RESEND_CODE = BASE_URL + 'resendverifycode';
export const UPDATE_USER = BASE_URL + 'userupdate';
export const NUZZLE_UP = BASE_URL + 'nuzzleup';
export const NUZZLE_UP_DELETE = BASE_URL + 'nuzzleupdelete';
export const USER_SETTING = BASE_URL + 'setting';
export const USER_INFO = BASE_URL + 'userinfo';
export const LIKE_DISLIKE = BASE_URL + 'likedislike';
export const FILTERATION = BASE_URL + 'filter';
export const NUZZLE_POINTS = BASE_URL + 'nuzzlepoints';
export const FORGOT_PASSWORD = BASE_URL + 'resetpassword';
export const GET_LOCATION_BASED_USER = BASE_URL + 'locationbasedusers';
export const LOG_OUT = BASE_URL + 'logout';
export const LIKE_USERS = BASE_URL + 'likeusers';
export const SEND_MESSAGE_NOTIFICATION = 'https://fcm.googleapis.com/fcm/send';
/**
 * Api Response Codes
 */
export const SUCCESS = 200;
export const CREATED = '201';
export const ACCEPED = '202';
export const ALREADY_REPORTED = '208';
export const UNAUTHORIZED = '401';
export const NOT_FOUND = '404';
export const NOT_LIKED = 0;
export const LIKED = 1;
// Api keys
export const CODE = 'code';
export const EMAIL = 'email';
export const USERNAME = 'username';
export const PASSWORD = 'password';
export const DEVICE_TYPE = 'device_type';
export const SOCIAL_LOGIN = 'social_login';
export const DEVICE_TOKEN = 'device_token';
export const NAME = 'name';
export const USER_PROFILE_INFO = 'userinfo';
export const AGE = 'age';
export const UID = 'uid';
export const ALREADY_LIKED = 'already_like';
export const PUSH_NOTIFICATION_SETTING = 'push_notification';
export const DISTANCE_RANGE = 'range';
export const AGE_RANGE = 'age_range';
export const USER_CATEGORY = 'user_category';
export const RADIUS = 'search_radius';
export const GENDER_PREFRENCE = 'gender_preference';
export const LATITUDE = 'latitude';
export const LONGTITUDE = 'longitude';
export const CURRENT_LOCATION = 'current_loaction';
export const LIKE = 'like';
export const BIO = 'bio';
export const GENDER = 'gender';
export const PROFILE_PIC = 'profile_pic';
export const CURRENT_PAGE = 'current_page';
export const ANOTHER_UID = 'another_uid';
export const CITY = 'city';
export const ZIP_CODE = 'zipcode';
export const ZIP_CODE_FILTER = 'filter-zipcode';
export const CUSTOM_FILTER = 'custom_filter';
// error message
export const enter_email = 'Please enter email.';
export const enter_valid_email = 'Please enter valid email address.';
export const enter_password = 'Please enter password.';
export const valid_password = 'Please enter 6 digit password.';
export const enter_name = 'Please enter name.';
export const enter_age = 'Please enter age.';
export const verification_pending = 'Account verification pending.';
export const resend_code = 'Code send to the email address.';
export const valid_code = 'Code is valid.';
export const code_not_empty = 'Code must not be empty';
export const email_verified = 'Email Verified successfully.';
export const failed = 'Failed';
