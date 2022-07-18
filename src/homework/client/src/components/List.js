import ListItem from "./ListItem";
import PropTypes from "prop-types";
import ListItemConnector from "./ListItemConnector";

function List({list,search}) {
	return (
		<>
			<ul id="my-ul">
				{list.map((item,index)=>{
				if(item.item.includes(search)){
					return <ListItemConnector data={item} key={index} />
				}
			})}
			</ul>
		</>
	);
}

ListItem.propTypes = {
	data: PropTypes.array,
	reload: PropTypes.func
};

export default List;
