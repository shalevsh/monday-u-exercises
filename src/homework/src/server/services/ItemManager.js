const pokemonClient = require("../clients/PokemonClient.js");
const { Item, Sequelize, sequelize } = require("../db/models");
const fs = require("fs").promises;
class ItemManager {
	constructor() {
		this.taskList = [];
		this.newItems = [];
		this.newItemsForTable = [];
	}
	async addTask(item){

	}
	async addPokemon(item){

	}
	async addItem(item) {
		this.newItems = [];
		this.newItemsForTable = [];
		this.taskList = await Item.findAll({ raw: true });
		const pokemonObj = await pokemonClient.checkByPokemonName(item);
		const { isPokemon, arrOfPokemonsID } = this.isPokemon(item);
		
		if (isPokemon || pokemonObj) {
			let ArrWithoutDuplicates;
			let pokemons;
			try {
				if (pokemonObj) {
					pokemons = [pokemonObj];
					const pokemonObjForTable = {
						isPokemon: true,
						item: "Catch " + pokemonObj.name,
						isDisplay: false,
						status: false,
						pokemon: pokemonObj
					};
					this.newItemsForTable.push(pokemonObjForTable);
					const pokemonObject = {
						isPokemon: true,
						item: "Catch " + pokemonObj.name,
						isDisplay: false,
						status: false,
						pokemon: pokemonObj
					};
					this.newItems.push(pokemonObject);
				} else {
					pokemons = await pokemonClient.fetchPokemon(
						arrOfPokemonsID
					);
					pokemons.forEach(pokemon => {
						const pokemonObjForTable = {
							isPokemon: true,
							item: "Catch " + pokemon.name,
							isDisplay: false,
							status: false,
							pokemon: pokemon
						};
						this.newItemsForTable.push(pokemonObjForTable);
						const pokemonObj = {
							isPokemon: true,
							item: "Catch " + pokemon.name,
							isDisplay: false,
							status: false,
							pokemon: pokemon
						};
						
						this.newItems.push(pokemonObj);
					});
				}

				this.taskList = this.taskList.concat(
					pokemons.map(pokemon => {
						const obj = {
							isPokemon: true,
							item: pokemon,
							isDisplay: false,
							status: false
						};
						return obj;
					})
				);
			} catch (exception) {
				let res = "";
				ArrWithoutDuplicates.forEach(elem => {
					res += elem + " ";
				});
			}
		} else {
			this.taskList.push({
				isPokemon: false,
				item: item,
				isDisplay: false,
				status: false
			});
			this.newItems.push({
				isPokemon: false,
				item: item,
				isDisplay: false,
				status: false
			});
			await Item.bulkCreate(this.newItems);
			const taskName =this.newItems[0].item
			const lineTable = await Item.findOne
				({ where: { item: taskName } });
			this.newItems[0].id = lineTable.id;
			return this.newItems;
		}

		await Item.bulkCreate(this.newItemsForTable);
		const taskName =this.newItems[0].item
		const lineTable = await Item.findOne
			({ where: { item: taskName } });
		this.newItems[0].id = lineTable.id;
		
		let t = this.newItems[this.newItems.length - 1];
		return t;
	}

	getItemsToAdd(arrOfNamesTasks) {
		const pokemonsArr = this.taskList
			.filter(task => task.isPokemon == true)
			.map(pokemon => pokemon.item);
		const ArrWithoutDuplicates = arrOfNamesTasks.filter(
			name => !pokemonsArr.includes(name)
		);
		return ArrWithoutDuplicates;
	}

	isPokemon(item) {
		const arr = item.split(/\s*,\s*/);
		let flag = false;
		arr.forEach(element => {
			if (!this.isNum(element)) {
				return;
			}
			flag = true;
		});
		return { isPokemon: flag, arrOfPokemonsID: arr };
	}

	isNum(val) {
		return !isNaN(val);
	}

	async loadTaskList() {
		this.taskList = await Item.findAll({ raw: true });
	}

	async getTaskList() {
		this.taskList = await Item.findAll({ raw: true }); // with id property
		this.taskList.reverse(); // with reverse
		return this.taskList;
	}

	async sortItems(type) {
		type = parseInt(type);
		let list = await Item.findAll({ raw: true });
		switch (type) {
			case 1:
				list = list.sort((a, b) => a.item.localeCompare(b.item));
				break;
			case 2:
				list = list.sort(
					(a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
				);
				break;
			case 3:
				let completed = list.filter(k => k.status === 1);
				let notCompleted = list.filter(k => k.status === 0);
				let all = [].concat(...notCompleted).concat(...completed);
				list = all;
				break;
			case 4:
				let completed1 = list.filter(k => k.status === 1);
				let notCompleted1 = list.filter(k => k.status === 0);
				let all1 = [].concat(...completed1).concat(...notCompleted1);
				list = all1;
				break;
		}

		this.taskList = list;
		return this.taskList;
	}

	async DeleteTask(itemId) {
		try {
			await Item.destroy({ where: { id: itemId } });
			const res = await Item.findAndCountAll();
			if (res.count == 0) {
				await Item.destroy({
					where: {},
					truncate: true,
					restartIdentity: true
				});
			}
		} catch (err) {
			throw `There is no task with id: ${itemId} `;
		}
	}

	async deleteAllItems() {
		this.taskList = [];
		this.newItems = [];
		await Item.destroy({
			where: {},
			truncate: true,
			restartIdentity: true
		});
	}

	async updateStatus(id) {
		await Item.update(
			{
				status: Sequelize.literal("NOT status")
			},
			{ where: { id: id } }
		);
		return true;
	}

	async updateDate(id, date) {
		await Item.update(
			{
				updatedAt: date
			},
			{ where: { id: id } }
		);
		return true;
	}
}

module.exports = new ItemManager();
