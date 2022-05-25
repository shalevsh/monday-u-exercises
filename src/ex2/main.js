import  ItemManager  from "./ItemManager.js";
class Main {
  constructor() {
   this.itemManager = new ItemManager();
   this.addButton = document.getElementById("addBtn");
   this.inputTaskName = document.getElementById("inputTask");
   this.sortButton = document.getElementById("sortBtn");
   this.clearAllButton = document.getElementById("clearBtn");
  }

  init() {
    this.ListenToAddItem()
    this.listenToSortButton();
    this.listenToClearAllTasks();

   

  }
 
   ListenToAddItem(){
      this.AddTaskByEnter();
      this.addButton.addEventListener("click", () => {
      this.itemManager.addItem(this.inputTaskName.value)
      this.inputTaskName.value = "";
      //Clear the input when a new item is added
    });
}
listenToSortButton(){
  this.sortButton.addEventListener("click", () => {
    this.itemManager.sortList();
})};
listenToClearAllTasks(){
  this.clearAllButton.addEventListener("click", () => {
    this.itemManager.clearList();
})};

  AddTaskByEnter() {
    this.inputTaskName.addEventListener("keypress", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.itemManager.addItem(this.inputTaskName.value)
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


