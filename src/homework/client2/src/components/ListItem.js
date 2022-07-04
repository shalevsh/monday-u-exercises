import React, { useState, useEffect } from "react";
import todoService from "../services/todo";
import moment from "moment";
import PropTypes from "prop-types";

function ListItem({ data, reload }) {
	const [status, setStatus] = useState(data.status);
	const [classes, setClasses] = useState("");

	useEffect(() => {
		setClasses(
			`${
				moment(data.updatedAt).diff(moment(), "minute") < 0
					? "markDeadline"
					: ""
			} ${status ? "checked" : ""}`
		);
	}, []);

	const hanldeUpdateDeadline = e => {
		let date = e.target.value;
		todoService
			.updateDate({
				id: data.id,
				date: date
			})
			.then(() => {
				reload();
			});
	};
	const hanldeUpdateStatus = e => {
		e.preventDefault();
		let n = e.target.checked;
		setStatus(n);
		todoService
			.updateStatus({
				id: data.id,
				status: n
			})
			.then(() => {
				reload();
			});
	};
	const hanldeUpdateStatusLi = e => {
		let n = !status;
		setStatus(n);
		todoService
			.updateStatus({
				id: data.id,
				status: n
			})
			.then(() => {
				reload();
			});
	};

	const handleDelete = e => {
		e.preventDefault();
		todoService.remove(data.id).then(() => {
			const spinning = [
				{ transform: "rotate(0) scale(1)" },
				{ transform: "rotate(0deg) scale(0)" }
			];
			const timing = {
				duration: 1000,
				iterations: 1
			};
			e.target.parentNode.animate(spinning, timing);
			setTimeout(() => reload(), 1000);
		});
	};

	return (
		<>
			<li className={classes}>
				<input
					type="datetime-local"
					className="calendarIcon"
					onChange={hanldeUpdateDeadline}
				/>
				<div onClick={hanldeUpdateStatusLi}>
					<input
						type="checkbox"
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
