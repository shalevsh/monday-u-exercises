// import  ItemManager  from "./ItemManager.js";
import item_client from "./clients/item_client.js";
import UiLogic from "./services/Uilogic.js";
class Main {
  constructor() {
  //  this.itemManager = new ItemManager();
   this.addButton = document.getElementById("add-btn");
   this.inputTaskName = document.getElementById("input-task");
   this.sortButton = document.getElementById("sort-btn");
   this.clearAllButton = document.getElementById("clear-btn");
  }

  async init() {
    const items = await item_client.fetchItems();
    console.log(items,"mewor42394392");
   await UiLogic.renderItem(items);
    this.AddTaskByEnter();




    await this.ListenToAddItem();
    this.listenToSortButton();
    this.listenToClearAllTasks();

   

  }
 
  async ListenToAddItem(){
      // await this.AddTaskByEnter();
      this.addButton.addEventListener("click", async() => {
    //  this.itemManager.addItem(this.inputTaskName.value)
      const items = await item_client.createItem(this.inputTaskName.value);
      UiLogic.renderItem([items]);
      this.inputTaskName.value = "";
      //Clear the input when a new item is added
    });
}
listenToSortButton(){
  this.sortButton.addEventListener("click", () => {
   // this.itemManager.sortList();
})};
listenToClearAllTasks(){
  this.clearAllButton.addEventListener("click", () => {
  //  this.itemManager.clearList();
})};

  AddTaskByEnter() {
    this.inputTaskName.addEventListener("keypress", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.addButton.click();
        this.inputTaskName.value = "";
      }
    });
  }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  // you should create an `init` method in your class
  // the method should add the event listener to your "add" button
  main.init();
  
  
});


