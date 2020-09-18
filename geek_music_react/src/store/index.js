import {
    createStore,
    // compose
} from 'redux';
import reducer from '../reducer';
import {
    persistStore,
    persistReducer
} from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // 使用localstorage进行存储
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storageSession from 'redux-persist/lib/storage/session'
const persistConfig = {
    key: 'root',
    storage: storageSession,
    stateReconciler: autoMergeLevel2 // 查看 'Merge Process' 部分的具体情况
};

const myPersistReducer = persistReducer(persistConfig, reducer)

const store = createStore(myPersistReducer)

export const persistor = persistStore(store)
export default store


// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(reducer, composeEnhancers());

// export default store;
// export default createStore(reducer);