import React, { useState, useEffect } from "react";
import SortDropdown from "./SortDropdown";
import List from "./List";
import todoService from "../services/todo";
import bg from "../images/bg.png";

function Main() {
	const [sort, setSort] = useState(1);
	const [task, setTask] = useState("");
	const [list, setList] = useState([]);

	useEffect(() => {
		reload();
	}, []);

	const reload = () => {
		setList([]);
		todoService.getList().then(result => {
			if (result.data) {
				setList(result.data);
			}
		});
	};

	const handleAddTodo = e => {
		e.preventDefault();
		if (!task) {
			alert(`You must write something!`);
			return;
		}

		todoService
			.create({
				item: task
			})
			.then(result => {
				if (result.data) {
					reload();
					setTask("");

					addPokemonImage(result.data.pokemon);
				}
			});
	};

	const handleKeyPress = e => {
		if (e.key === "Enter") {
			handleAddTodo(e);
		}
	};

	const addPokemonImage = pokemonObj => {
		if (!pokemonObj || !pokemonObj.sprites) return;
		const url = pokemonObj.sprites.front_default;
		document.getElementById("imageNBA").setAttribute("src", url);
		document.getElementsByClassName("NbaImage")[0].style.visibility =
			"visible";
		const spinning = [
			{ transform: "rotate(0deg) scale(0)" },
			{ transform: "rotate(0) scale(1)" }
		];
		const timing = {
			duration: 2000,
			iterations: 1
		};
		document.getElementById("imageNBA").animate(spinning, timing);
		setTimeout(() => {
			const spinning = [
				{ transform: "rotate(0) scale(1)" },
				{ transform: "rotate(0deg) scale(0)" }
			];
			const timing = {
				duration: 2000,
				iterations: 1
			};
			document.getElementById("imageNBA").animate(spinning, timing);
			setTimeout(() => {
				document.getElementsByClassName(
					"NbaImage"
				)[0].style.visibility = "hidden";
			}, 500);
		}, 2000);
	};

	const handleClearAll = e => {
		e.preventDefault();
		todoService.removeAll().then(() => {
			reload();
		});
	};

	const handleSort = e => {
		e.preventDefault();
		setList([]);
		todoService.getSorted(sort).then(result => {
			if (result.data) {
				setList(result.data);
			}
		});
	};

	return (
		<>
			<div className="container">
				<label id="drag-list" htmlFor="sort-dropdown">
					{" "}
					Draglist type sorts
				</label>
				<SortDropdown
					value={sort}
					onChange={e => setSort(e.target.value)}
				/>
			</div>
			<div>
				<input
					type="text"
					id="input-task"
					placeholder="Title..."
					style={{ marginLeft: 70 }}
					value={task}
					onChange={e => setTask(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<button className="btn" id="add-btn" onClick={handleAddTodo}>
					+
				</button>
			</div>

			<br />
			<List data={list} reload={reload} />

			{list.length > 0 && (
				<div className="container" style={{ marginBottom: 10 }}>
					you have <span>{list.length}</span> tasks
					<button className="vbtn" id="sort-btn" onClick={handleSort}>
						Sort
					</button>
					<button
						className="vbtn"
						id="clear-btn"
						onClick={handleClearAll}
					>
						Clear All
					</button>
				</div>
			)}

			<div style={{ visibility: "hidden" }} className="NbaImage">
				<img id="imageNBA" src={bg} style={{ width: 684 }} />
			</div>
			<div className="floating" id="floating_square">
				<h2
					style={{
						textAlign: "center",
						lineHeight: 2,
						color: "beige"
					}}
				>
					WAIT
					<br />
					FOR
					<br />
					TASKS
				</h2>
			</div>
		</>
	);
}

export default Main;
