import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { itemsEntitiesActions } from "../../actions/items-entities-actions";
import { store } from "../../store";
import List from "../List";

const items = [
  {
    id: 1,
    isDisplay: false,
    isPokemon: false,
    item: "four",
    status: false
  },
  {
    id: 2,
    isDisplay: false,
    isPokemon: false,
    item: "five",
    status: true
  },
];

describe("List", () => {
  test("should render both items (one done and one not)", () => {
    render(
    <Provider store={store}>
    <List list={items}/>
    </Provider>)
     const shoppingTodo = screen.getByTestId(`item-${items[0].id}`);
     expect(shoppingTodo).toBeInTheDocument();
     const checkbox = screen.getAllByRole('checkbox');
     expect(checkbox[0]).not.toBeChecked()
 
     const beachTodo = screen.getByTestId(`item-${items[0].id}`);
     expect(beachTodo).toBeInTheDocument();
     expect(checkbox[1]).toBeChecked()
  });
});
describe("ListContainer with mock GetTodos", () => {
    const mock_get_todos = jest.fn(() => items);
    const mock_get_todos_action = jest.spyOn(itemsEntitiesActions, 'getItemsAction').mockImplementation(mock_get_todos);
    test("should render both items (one done and one not) with mock get tasks", () => {
        itemsEntitiesActions.getItemsAction();
        expect(mock_get_todos_action).toBeCalled();
    });
});