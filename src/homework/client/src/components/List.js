import ListItem from "./ListItem";
import PropTypes from "prop-types";
import ListItemConnector from "./ListItemConnector";

function List({list}) {
	return (
		<>
			<ul id="my-ul">
				{
				list.map((item,index)=> (
				//	<ListItem key={item.id} data={item} reload={reload} />
				<ListItemConnector data={item} key={index} />
				))}
			</ul>
		</>
	);
}

ListItem.propTypes = {
	data: PropTypes.array,
	reload: PropTypes.func
};

export default List;
