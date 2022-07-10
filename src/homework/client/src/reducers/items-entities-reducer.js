import actionTypes from "../actions/constants";
import todoService from "../services/todo";

const initialState = {List:[]};

const itemsEntitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LIST: 
    return{...state,List: action.payload};

    case actionTypes.ADD_ITEMS:
    return{...state,List:[...state.List,...action.payload]};

    case actionTypes.DELETE_ITEM:
      return {
        ...state,
        items: [
          ...state.items.filter((item) => item.itemId !== action.payload),
        ],
      };

      case actionTypes.UPDATE_CHECKBOX:
      return {
        ...state,
        items: state.items.map((item) =>
          item.itemId === action.itemId
            ? { ...item, status: action.payload }
            : item
        ),
      };

      case actionTypes.CLEAR_ALL_ITEMS:
        return {
          ...state,
          items: [],
        };

        case actionTypes.UPDATE_SEARCH_INPUT:
        return {
          ...state,
          searchInput: action.payload
        };


    default:
      return state;
  }
};

export function getList() {
  return async function fetchTodos(dispatch, getState) {
    try {
      const response = await todoService.getList();
      dispatch({ type: actionTypes.LIST, payload: response });
    } catch (error) {
      dispatch({ type: actionTypes.FAILED, payload: error.message });
    }
  }
}
export default itemsEntitiesReducer;
