import ListItem from "./ListItem";
import PropTypes from "prop-types";

function List({list,reload}) {
	return (
		<>
			<ul id="my-ul">
				{list.map(k => (
					<ListItem key={k.id} data={k} reload={reload} />
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
