import actions from './actions';

const initialState = {
    data: []
};

export default function dataReducer(state = initialState, action) {
	switch (action.type) {
		case actions.UPDATE_DATA:
		return {
			...state,
			data: action.payload
		};
		default:
		return state;
	};
};