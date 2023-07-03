import {createStore, applyMiddleware, combineReducers} from 'redux';
import saga from './saga';
import RootReducer from './reducers/RootReducer';
import createSagaMiddleware from 'redux-saga';
import {
  persistStore,
  persistCombineReducers,
  persistReducer,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// redux-persist
const persistReduce = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['loginReducer', 'verificationReducer', 'registerReducer'],
  },
  RootReducer,
);

const sagaMiddleware = createSagaMiddleware();

//store
const store = createStore(persistReduce, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);
sagaMiddleware.run(saga);

export {store, persistor};

//export default persistor
