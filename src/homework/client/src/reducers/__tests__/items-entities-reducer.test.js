import itemsEntitiesReducer from "../items-entities-reducer";
import { addItems } from "../../actions/items-entities-actions";


test("should return the initial state", () => {
  expect(itemsEntitiesReducer(undefined, { type: undefined })).toEqual({
    List: [],
  });
});

test("should add new todos to empty list", () => {
  const previousState = {
    List: [],
  };
  const newItem={data:[
    {
        id: 1,
        isDisplay: false,
        isPokemon: false,
        item: "five",
        status: false
    }
],error:null};
  expect(itemsEntitiesReducer(previousState, addItems(newItem))).toEqual({
    List: [...newItem.data],
  });
 
});

test(' should add new todos to the existing list', () => {
   
    const newItems={data:[
        {
            id: 2,
            isDisplay: false,
            isPokemon: false,
            item: "five",
            status: false
        }
    ],error:null};
    const oldItems={data:[
        {
            id: 1,
            isDisplay: false,
            isPokemon: false,
            item: "four",
            status: false
        }
    ],error:null};

    const previousState = {
        List: [...oldItems.data],
    };
    expect(itemsEntitiesReducer(previousState, addItems(newItems))).toEqual(
      { List: [...oldItems.data, ...newItems.data] }
    )
  })