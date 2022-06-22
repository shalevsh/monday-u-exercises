const express = require("express");
const itemRouter = express.Router();
const {
  createItem,
  deleteItem,
  getAllItems,
  deleteAllItems,
  sortItems,
} = require("../controllers/itemController.js");

itemRouter.post("/", createItem);
itemRouter.get("/", getAllItems);
itemRouter.delete("/", deleteAllItems);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/sort", sortItems);


module.exports =itemRouter;