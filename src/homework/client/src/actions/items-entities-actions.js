import actionTypes from "./constants";
import todoService from "../services/todo";

// const updateSearchInput = (searchInput) => ({
//   type: actionTypes.UPDATE_SEARCH_INPUT,
//   payload: searchInput,
// });

// export const updateSearchInputAction = (searchInput) => {
//   return async (dispatch) => {
//     dispatch(updateSearchInput(searchInput));
//   };
// };

const clearAllItems = () => ({
  type: actionTypes.CLEAR_ALL_ITEMS,
});

export const clearAllItemsAction = () => {
  return async (dispatch) => {
    await todoService.removeAll()
    dispatch(clearAllItems());
  };
};

const addItems = (newItems) => ({
  type: actionTypes.ADD_ITEMS,
  payload: newItems,
});

export const addItemsAction = (newItems) => {
  return async (dispatch) => {
    const addedItems = await todoService.create(newItems);
    dispatch(addItems(addedItems));
  };
};

const itemToDelete = (itemId) => ({
  type: actionTypes.DELETE_ITEM,
  payload: itemId,
});

export const deleteItemAction = (itemId) => {
  return async (dispatch) => {
    await todoService.remove(itemId);
    dispatch(itemToDelete(itemId));
  };
};

const updateItemStatus = (object) => ({
  type: actionTypes.UPDATE_CHECKBOX,
  itemId: object.itemId,
  payload: object.checked,
});

export const updateCheckBoxAction = (object) => {
  return async (dispatch) => {
    await todoService.updateStatus(object);
    dispatch(updateItemStatus(object));
  };
};

export const getItemsAction = () => {
  return async (dispatch) => {
    const items = await todoService.getList();
    dispatch(addItems(items));
  };
};