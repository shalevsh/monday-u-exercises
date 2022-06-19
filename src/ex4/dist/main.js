import item_client from "./clients/item_client.js";
import UiLogic from "./services/Uilogic.js";
class Main {
  constructor() {
   this.addButton = document.getElementById("add-btn");
   this.inputTaskName = document.getElementById("input-task");
   this.sortButton = document.getElementById("sort-btn");
   this.clearAllButton = document.getElementById("clear-btn");
  }
   checkObject(arr) {
    // check if arr is array
    const result = Array.isArray(arr);
    return result;
  }
  async init() {
    const items = await item_client.fetchItems();
    await UiLogic.renderItem(items);
    this.AddTaskByEnter();
    await this.ListenToAddItem();
    this.listenToSortButton();
    this.listenToClearAllTasks();
  }
 
  async ListenToAddItem(){
      this.addButton.addEventListener("click", async() => {
      const items = await item_client.createItem(`${this.inputTaskName.value}`);
      if(this.checkObject(items)===true){
        items.forEach(element => {
          UiLogic.renderItem([element]);
        });
      }else{
        UiLogic.renderItem([items]);
      }
      this.inputTaskName.value = "";
    });
}
async listenToSortButton(){
  this.sortButton.addEventListener("click",async() => {
  const sorted =  await item_client.sortItems();
  await UiLogic.renderItem(sorted);
})};

async listenToClearAllTasks(){
  this.clearAllButton.addEventListener("click", async() => {
    const result = await item_client.deleteAllItems();
    window.location.reload();
  })
};

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


