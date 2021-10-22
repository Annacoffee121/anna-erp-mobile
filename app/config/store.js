import {createStore, applyMiddleware} from 'redux';
import {rootReducer} from '../reducers';

// Middleware
import thunk from 'redux-thunk';
import auth from '../middlewares/auth';

export const configStore = (initialStage) => createStore(
    rootReducer,
    initialStage,
    applyMiddleware(
        thunk,
        auth,
    )
);