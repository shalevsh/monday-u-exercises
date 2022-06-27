const express = require("express");
const itemRouter = express.Router();
const {
  createItem,
  deleteItem,
  getAllItems,
  deleteAllItems,
  sortItems,
  updateStatus,
} = require("../controllers/itemController.js");

itemRouter.post("/", createItem);
itemRouter.get("/", getAllItems);
itemRouter.delete("/", deleteAllItems);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/sort", sortItems);
itemRouter.patch("/:id", updateStatus);

module.exports =itemRouter;