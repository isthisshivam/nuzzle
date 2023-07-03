import * as index from './index'


// init Register
export function startRegister (obj, onSuccess, onFailure) {
    return {
       type : index.REGISTER_USER,
        payload : { 
            obj
        },
        onSuccess,
        onFailure
    }
}


// login success
export function registerSuccess(userData, onSuccess,onFailure) {
    return{
        type: index.REGISTER_SUCCESS,
        payload:{
            userData
        },
        onSuccess,
        onFailure
    }
}

// login fail
export function registerFailure(userData, onSuccess,onFailure) {
    return{
        type: index.ON_ERROR,
        payload:{
            userData
        },
        onSuccess,
        onFailure
    }
}