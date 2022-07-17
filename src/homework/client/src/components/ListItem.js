import React, { useState, useEffect, useCallback } from "react";
import todoService from "../services/todo";
import moment from "moment";
import PropTypes from "prop-types";


function ListItem({ data,deleteItemAction,updateCheckBoxAction}) {
	console.log(data,"data lantsman")
	const [status, setStatus] = useState(data.status);
	const [classes, setClasses] = useState("");
	

	useEffect(() => {
		setClasses(
			`${moment(data.updatedAt).diff(moment(), "minute") < 0 ? "markDeadline":""}
			 ${status ? "checked" : ""}`
		);

	}, [classes]);

	const hanldeUpdateDeadline = e => {
		let date = e.target.value;
		todoService
			.updateDate({
				id: data.id,
				date: date
			})
			.then(() => {
				// reload();
			});
	};
	const hanldeUpdateClick = useCallback(()=>{
		updateCheckBoxAction(data);
	},[updateCheckBoxAction]);


	const hanldeUpdateStatus = e => {
		e.preventDefault();
		if(!status){
		setClasses("checked");
		}else{
		setClasses("");
		}
		setStatus(!status);
	};
	
	const handleDelete = e => {
		e.preventDefault();
		deleteItemAction(data.id);
		
	};
  

	return (
		<>
			<li className={classes}>
				<input
					type="datetime-local"
					className="calendarIcon"
					onChange={hanldeUpdateDeadline}
				/>
				<div>
					<input
						type="checkbox"
						onClick={hanldeUpdateClick}
						checked={status}
						onChange={hanldeUpdateStatus}
					/>
					 {data.item}
				</div>
				<span className="close" onClick={handleDelete}>
					{"\u00D7"}
				</span>
			</li>
		</>
	);
}

ListItem.propTypes = {
	data: PropTypes.object,
	reload: PropTypes.func
};

export default ListItem;
