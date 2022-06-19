import express from "express";
const itemRouter = express.Router();
import {
  createItem,
  deleteItem,
  getAllItems,
  deleteAllItems,
  sortItems,
} from "../controllers/itemController.js";

itemRouter.post("/", createItem);
itemRouter.get("/", getAllItems);
itemRouter.delete("/", deleteAllItems);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/sort", sortItems);


export default itemRouter;