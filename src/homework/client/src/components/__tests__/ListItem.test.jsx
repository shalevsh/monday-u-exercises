import renderer from "react-test-renderer";
import ListItem  from "../ListItem"

 const item={
            id: 1,
            isDisplay: false,
            isPokemon: false,
            item: "four",
            status: false
        };
    
test("renders correctly pending todo", () => {
  const tree = renderer
    .create(<ListItem data={item}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});