const ItemManager = require("../services/ItemManager.js");
async function createItem(req, res, next) {
	try {
		const item = req.body.item;
		const data = await ItemManager.addItem(item);
		res.status(201).json(data);
	} catch (err) {
		next(err);
	}
}

async function deleteItem(req, res, next) {
	try {
		const itemId = parseInt(req.params.id);
		await ItemManager.DeleteTask(itemId);
		res.status(200).json(itemId);
	} catch (err) {
		next(err);
	}
}

async function sortItems(req, res, next) {
	try {
		const type = req.params.type;
		const items = await ItemManager.sortItems(type);
		res.status(200).json(items);
	} catch (err) {
		next(err);
	}
}

async function getAllItems(req, res, next) {
	try {
		const items = await ItemManager.getTaskList();
		res.status(200).json(items);
	} catch (err) {
		next(err);
	}
}

async function deleteAllItems(req, res, next) {
	try {
		const result = await ItemManager.deleteAllItems();
		if (result) res.status(200).json("all items deleted");
		else res.status(400).json("Error Occured");
	} catch (err) {
		next(err);
	}
}

async function updateStatus(req, res, next) {
	try {
		const id = req.params.id;
		const status = req.body.status;
		const result = await ItemManager.updateStatus(id, status);

		if (result) res.status(200).json("item update");
		else res.status(400).json("Error Occured");
	} catch (err) {
		next(err);
	}
}

async function updateDate(req, res, next) {
	try {
		const id = req.params.id;
		const date = req.body.date;
		const result = await ItemManager.updateDate(id, date);

		if (result) res.status(200).json("item update");
		else res.status(400).json("Error Occured");
	} catch (err) {
		next(err);
	}
}
module.exports = {
	createItem,
	deleteItem,
	sortItems,
	getAllItems,
	deleteAllItems,
	updateStatus,
	updateDate
};
