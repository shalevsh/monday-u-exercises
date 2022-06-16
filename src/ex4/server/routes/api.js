import express from "express";
const itemRouter = express.Router();
import {
  createItem,
  //deleteItem,
  //getAllItems,
  //deleteAllItems,
} from "../controllers/itemController.js";

itemRouter.post("/", createItem);
// itemRouter.get("/", getAllItems);
// itemRouter.delete("/", deleteAllItems);
// itemRouter.delete("/:id", deleteItem);


export default itemRouter;