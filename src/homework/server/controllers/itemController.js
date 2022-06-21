import ItemManager from "../services/ItemManager.js"
export async function createItem(req, res, next) {
    try {
       const item = req.body.item;
       const data  = await ItemManager.addItem(item);
       res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
  
  export async function deleteItem(req, res, next) {
    try {
      const itemId = parseInt(req.params.id);
      await ItemManager.DeleteTask(itemId);
      res.status(200).json(itemId);
    } catch (err) {
      next(err);
    }
  }

  export async function sortItems(req, res, next) {
    try {
      const items = await ItemManager.sortItems();
      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }

  export async function getAllItems(req, res, next) {
    try {
      const items = await ItemManager.getTaskList();
      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }
  
  export async function deleteAllItems(req, res, next) {
      try {
        const result = await ItemManager.deleteAllItems();
        if(result) res.status(200).json('all items deleted');
        else res.status(400).json('Error Occured');
      } catch (err) {
        next(err);
      }
    }