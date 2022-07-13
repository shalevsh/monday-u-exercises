import React, { useState, useEffect } from "react";
import SortDropdown from "./SortDropdown";
import ListConnector from "./ListConnector";
import todoService from "../services/todo";
function Main({addItemsAction,list,clearAllItemsAction,getItemsAction}) {
	const [sort, setSort] = useState(1);
	const [task, setTask] = useState("");
	const [search, setSearch] = useState("");
	const [showImage, setShowImage] = useState(false);
	const [image, setImage] = useState("");
	
	useEffect(() => {
		getItemsAction();
	},[]);
	useEffect(() => {
		if(list.length> 0 && list[list.length-1].isPokemon){
		const pokemonObj= list[list.length-1].pokemon;
		if(!showImage){
		addPokemonImage(pokemonObj);
		}
		}
	},[list]);

	const handleAddTodo = e => {
		e.preventDefault();
		if (!task) {
			alert(`You must write something!`);
			return;
		}
		
		addItemsAction({item:task});		
		}
	
	const handleKeyPress = e => {
		if (e.key === "Enter") {
			handleAddTodo(e);
		}
	};

	    const addPokemonImage = pokemonObj => {
		if (!pokemonObj || !pokemonObj.sprites) return;
		setShowImage(true);
		setImage(pokemonObj.sprites.front_default);
			setTimeout(() => {
			setShowImage(false);
			}, 1500);
	};

	 const handleClearAll = async(e) => {
		e.preventDefault();
		await clearAllItemsAction();
	};

	const handleSort = e => {
		e.preventDefault();
		//setList([]);
		todoService.getSorted(sort).then(result => {
			if (result.data) {
				//setList(result.data);
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

			<div>
			<input
					type= "text"
					id="input-search-task"
					placeholder="Search..."
					style={{ marginLeft: 70 }}
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<button className="btn" id="search-btn" onClick={handleAddTodo}>
					+
				</button>
			</div>

			<br />
			<ListConnector search={search}/>
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

			{showImage&&<div className="pokemonImage">
				<img src={image} style={{ width: 684 }} />
			</div>}
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
