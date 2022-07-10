import actionTypes from "../actions/constants";
import todoService from "../services/todo";

const initialState = {List:{}};

const itemsEntitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_LIST: return{...state,List: action.payload};

    default:
      return state;
  }
};

export function getList() {
  return async function fetchTodos(dispatch, getState) {
    try {
      const response = await todoService.getList();
      dispatch({ type: actionTypes.GET_LIST, payload: response });
    } catch (error) {
      dispatch({ type: actionTypes.FAILED, payload: error.message });
    }
  }
}
export default itemsEntitiesReducer;
