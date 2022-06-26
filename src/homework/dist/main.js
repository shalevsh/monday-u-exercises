//  const item_client = require("./clients/item_client.js");
// const UiLogic = require("./services/Uilogic.js");
class Main {
  constructor() {
   this.item_client= new ItemClient();
   this.uiLogic= new UiLogic();

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
    const items = await this.item_client.fetchItems();
    await this.uiLogic.renderItem(items);
    this.AddTaskByEnter();
    await this.ListenToAddItem();
    this.listenToSortButton();
    this.listenToClearAllTasks();
  }
 
  async ListenToAddItem(){
      this.addButton.addEventListener("click", async() => {
      const items = await this.item_client.createItem(`${this.inputTaskName.value}`);
      
      if(this.checkObject(items)===true){
        items.forEach(element => {
          this.uiLogic.renderItem([element]);
        });
      }else{
        this.uiLogic.renderItem([items]);
      }
      this.inputTaskName.value = "";
    });
}
async listenToSortButton(){
  this.sortButton.addEventListener("click",async() => {
  const sorted =  await this.item_client.sortItems();
  await this.uiLogic.renderItem(sorted);
})};

async listenToClearAllTasks(){
  this.clearAllButton.addEventListener("click", async() => {
    const result = await this.item_client.deleteAllItems();
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


