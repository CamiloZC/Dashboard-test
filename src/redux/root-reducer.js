import { combineReducers } from 'redux';
import Data from './data-reducer/reducer';

const rootReducer = combineReducers({
  Data,
});

export default rootReducer;