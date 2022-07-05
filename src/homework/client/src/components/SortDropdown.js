import PropTypes from "prop-types";

function SortDropdown(props) {
	return (
		<>
			<select
				id="sort-dropdown"
				defaultValue={props.value}
				onChange={props.onChange}
			>
				<option value="1">ABC</option>
				<option value="2">Deadline</option>
				<option value="3">Not complete</option>
				<option value="4">Finished</option>
			</select>
		</>
	);
}

SortDropdown.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func
};

export default SortDropdown;
