const express = require("express");
const itemRouter = express.Router();
const {
	createItem,
	deleteItem,
	getAllItems,
	deleteAllItems,
	sortItems,
	updateStatus,
	updateDate
} = require("../controllers/itemController.js");

itemRouter.post("/", createItem);
itemRouter.get("/", getAllItems);
itemRouter.delete("/", deleteAllItems);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/sort/:type", sortItems);
itemRouter.patch("/:id", updateStatus);
itemRouter.put("/date/:id", updateDate);

module.exports = itemRouter;
