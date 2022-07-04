import ListItem from "./ListItem";
import PropTypes from "prop-types";

function List(props) {
	return (
		<>
			<ul id="my-ul">
				{props.data.map(k => (
					<ListItem key={k.id} data={k} reload={props.reload} />
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
