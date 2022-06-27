const TYPE_DEADLINE = 1
const TYPE_NOTCOMPLETE = 2
const TYPE_FINISHED = 3
const TYPE_DEADLINE_FINISHED = 4
const SORT_ALPHABATICALLY = 1;
const SORT_DEADLINE = 2;
const SORT_NOTCOMPLETE = 3;
const SORT_FINISHED = 4;

class UiLogic {
  constructor() {
    this.taskList = [];
    this.itemClient = new ItemClient();
  }

  async renderItem(taskList) {
    await this.addTaskWatcher();
    const filterTaskList = taskList.filter((element) => element.isDisplay == false);
    filterTaskList.forEach(async (element) => {
      let taskName;
      const isPokemon = element.isPokemon;
      const taskId = element.id
      if (isPokemon == false) {
        taskName = element.item
      } else {
        if(typeof element.item  === 'string'){;
        taskName = element.item
        }else{
          taskName = element.item.name
        }       
      }
      element.isDisplay = true;
     await this.CreateNewListItemElement(taskName, taskList, isPokemon,taskId);
    });
  }

  async addTaskWatcher() {
     setInterval(async() => {
      let deadLineReachedTask = this.taskList.filter(x => x.type == TYPE_DEADLINE).filter((x) => x.datetime < new Date());
      if (deadLineReachedTask && deadLineReachedTask.length > 0) {
        let ids = deadLineReachedTask.map(x => x.id);
        for (let index = 0; index < ids.length; index++) {
          const liId = ids[index];
          let task = getTask(liId);
          this.updateTask(task.id, TYPE_DEADLINE_FINISHED, task.name, task.datetime, task.isAnimated);
          await this.bindTaskList(false);

        }
      }

    }, 1000)
  }

  addTask(type, name, date, isPokemon,taskId) {
     let id = taskId === undefined ? this.getId(): taskId;
    if (isPokemon == true) {
      name = "Catch " + name;
    }
    this.taskList.push({ id: id, type: type, name: name, datetime: date, createDateTime: new Date(), isAnimated: true });
    return id;
  }
 async CreateNewListItemElement(taskString, taskObject, isPokemon,taskId) {
    if (taskString === '') {
      alert("You must write something!");
    } else {
      this.addTask(TYPE_NOTCOMPLETE, taskString, null, isPokemon,taskId);
     await this.bindTaskList(false, taskObject)
    }
  }

  getId() {
    if (this.taskList.length == 0) {
      return 1;
    }
    const latestId = this.taskList.map(x => x.id).sort((p, c) => c - p);
    return latestId[0] + 1;

  }
  getTask(id) {
    return this.taskList.filter(x => x.id == id)[0]
  }

  updateTask(id, type, name, date, isAnimated) {
    let indexFound = 0;
    let createDateTime = new Date();
    for (let index = 0; index < this.taskList.length; index++) {
      let element = this.taskList[index];
      if (element.id == id) {
        createDateTime = element.createDateTime;
        indexFound = index;
        break;
      }
    }

    this.taskList[indexFound] = { id: id, type: type, name: name, datetime: date, createDateTime: createDateTime, isAnimated: isAnimated };
  }

  async bindTaskList(withSort, taskObject) {
    let sortedList = this.getSortedTaskList(withSort);
    console.log(sortedList.length,"sortedList.length");
    if (sortedList.length > 0) {
      document.getElementById("my-ul").innerHTML = "";
      for (let index = 0; index < sortedList.length; index++) {
        const LiObject = sortedList[index];
        if (taskObject) {
          console.log(LiObject,"LiObject");
          console.log(taskObject,"taskObject");

         await this.CreateNewListItemElementByTaskObject(LiObject, taskObject, index)
        } else {
         await this.CreateNewListItemElementByTaskObject(LiObject, sortedList, index)
        }
      }
    }

  }

  getSortedTaskList(withSort) {
    let sortTaskList = []
    let sortBy = document.getElementById('sort-dropdown').value
    if (this.taskList.some(x => x.type == TYPE_DEADLINE_FINISHED)) {
      sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type == TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.datetime.getTime() - a.datetime.getTime(); }));
    }
    if (withSort) {
      if (sortBy == SORT_ALPHABATICALLY) {
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => {
          let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
          if (nameA < nameB) //sort string ascending
            return -1;
          if (nameA > nameB)
            return 1;
          return 0; //default return value (no sorting)
        }));
      }
      else if (sortBy == SORT_DEADLINE) {
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type == TYPE_DEADLINE).sort((a, b) => { return a.datetime.getTime() - b.datetime.getTime(); }));
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type != TYPE_DEADLINE && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      }
      else if (sortBy == SORT_FINISHED) {
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type == TYPE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type != TYPE_FINISHED && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      }

      else if (sortBy == SORT_NOTCOMPLETE) {
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type == TYPE_NOTCOMPLETE).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
        sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type != TYPE_NOTCOMPLETE && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      }
    }
    else {
      sortTaskList = sortTaskList.concat(this.taskList.filter(x => x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }
    return sortTaskList;
  }

 async CreateNewListItemElementByTaskObject(taskObject, taskList, index) {
    console.log(taskObject.name,"create html taskObject")
    // document.getElementById("my-ul").innerHTML = '';
    // Create a new list item when clicking on the "Add" button
    const li = document.createElement("li");   //create new list item html element  
    const checkbox = this.createCheckBox(taskObject.status,taskObject.id,li);
     // create text html element with user task input name
    // if user task input name is empty string, show it at alert dialog, else append the LI element to UL.
   
    li.setAttribute("id", `task${taskObject.id}`);
    li.setAttribute("taskId", `${taskObject.id}`);
    li.append(checkbox);

    if(taskObject.status ==true){
      this.CheckedTask(li,true);
    }
    const textElement = document.createTextNode(taskObject.name);

    this.DisplayDropdown(); //display dropdown
    this.VanishEmptyTaskFloatMassage();
    li.appendChild(textElement); // append text element to list item element
    document.getElementById("my-ul").appendChild(li);
    this.handleCountTask();
    if (taskObject.isAnimated) {
      this.AnimateListAdd(li);
      this.updateTask(taskObject.id, taskObject.type, taskObject.name, taskObject.datetime, false)
    }
    this.DisplayInvisibleButtons(); // display sort and clear all buttons
    li.addEventListener("click", ({ target }) => {
      this.CheckedTask(target, false); // mark task for complete status
    });
    await this.CreateRemoveItemFromList(li, taskList, taskObject.id);

    // create checkBox  
   
    this.addCalendarIcon(li, taskObject.datetime);
    const pokemonObj = this.getPokemonObjectByName(taskList, taskObject.name);
    if (pokemonObj !== null && index === 0) {
      this.addPokemonImage(pokemonObj);
    }
    // if (taskObject.type == TYPE_FINISHED) {
    //   this.CheckedTask(li, true)
    // }
    else if (taskObject.type == TYPE_DEADLINE_FINISHED) {
      li.classList.add('markDeadline');
    }

  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  CheckedTask(target, withSort) {
    if (target.tagName == "INPUT" || target.tagName == "BUTTON") {
      return;
    }
    // Add a "checked" symbol when clicking on a list item
    if (!target.classList.contains('checked')) {
      const id = target.getAttribute('taskId')
      let taskObject = this.getTask(id);
    }
    else {
      let taskObject = this.getTask(target.getAttribute('taskId'));
      this.updateTask(taskObject.id, TYPE_NOTCOMPLETE, taskObject.name, taskObject.datetime, false)
    }
    target.classList.toggle('checked');
  }


  async sortList() {
   await this.bindTaskList(true);
  }

  clearList() {
    this.taskList = [];
    this.VanishvisibleButtons();
    this.DisplayEmptyTaskFloatMassage();
    document.getElementById("my-ul").innerHTML = "";
    this.handleCountTask();
  }

  VanishvisibleButtons() {
    const sortButton = document.getElementById("sort-btn");
    const clearButton = document.getElementById("clear-btn");
    sortButton.style.visibility = "hidden";
    clearButton.style.visibility = "hidden";
    this.VanishDropdown();
  }
  DisplayInvisibleButtons() {
    const sortButton = document.getElementById("sort-btn");
    const clearButton = document.getElementById("clear-btn");
    sortButton.style.visibility = "visible";
    clearButton.style.visibility = "visible";
  }

  AnimateListItemDelete(li) {
    const spinning = [
      { transform: 'rotate(0) scale(1)' },
      { transform: 'rotate(0deg) scale(0)' }
    ];
    const timing = {
      duration: 2000,
      iterations: 1,
    }
    li.animate(spinning, timing);
  }

  AnimateListAdd(li) {
    const spinning = [
      { transform: 'rotate(0deg) scale(0)' },
      { transform: 'rotate(0) scale(1)' }

    ];
    const timing = {
      duration: 500,
      iterations: 1,
    }
    li.animate(spinning, timing);
  }
  VanishEmptyTaskFloatMassage() {
    const floating = document.getElementById("floating_square");
    floating.style.visibility = "hidden";
  }
  DisplayEmptyTaskFloatMassage() {
    const floating = document.getElementById("floating_square");
    floating.style.visibility = "visible";
  }

  async CreateRemoveItemFromList(li, taskList, idItem) {
    const span = document.createElement("SPAN");
    const txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    span.onclick = async () => {
    await this.itemClient.deleteItem(idItem-1);
      const spinning = [
        { transform: 'rotate(0) scale(1)' },
        { transform: 'rotate(0deg) scale(0)' }
      ];
      const timing = {
        duration: 1000,
        iterations: 1,
      }
      li.animate(spinning, timing);
      const id = li.getAttribute('taskId');
      this.taskList = this.taskList.filter(x => x.id != id);
      setTimeout(() => {

        taskList[id - 1] = undefined;
        li.remove();
        this.handleCountTask();

      }, 1000)

      const ul = document.getElementById("my-ul");   //extract user task input string name
      if (ul.childElementCount === 1) {
        this.VanishvisibleButtons();
        this.DisplayEmptyTaskFloatMassage();
      }
    }
  }


  addCalendarIcon(li, deadLineText) {
    const input = document.createElement("input");
    input.setAttribute('type', "datetime-local")
    input.className = "calendarIcon";
    input.onchange = () => {
      let task = this.getTask(li.getAttribute("taskId"));
      this.updateTask(task.id, TYPE_DEADLINE, task.name, new Date(input.value), task.isAnimated)
      input.nextElementSibling.innerHTML = new Date(input.value);
    }
    input.onclick = function () {
      input.nextElementSibling.nextElementSibling.style.display = "block";
    }
    input.onblur = function () {
      setTimeout(() => {
        input.nextElementSibling.nextElementSibling.style.display = "none";
      }, 500);
    }
    input.onmouseenter = function () {
      if (input.nextElementSibling.innerHTML != "") {
        input.nextElementSibling.style.display = "block";
      }
    }
    input.onmouseleave = function (target) {
      input.nextElementSibling.style.display = "none";
    }
    li.appendChild(input);

    const div = document.createElement("div");
    if (deadLineText) {
      div.innerText = deadLineText;
    }
    div.classList.add("popup");
    div.style.display = "none";

    li.appendChild(div);
    const btn = document.createElement("button");
    btn.innerText = "Select Date"
    btn.style.display = "none";
    btn.classList.add('selectDate')

    li.appendChild(btn);

  }

  formatDate(date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        // padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
      ].join(':')
    );
  }
  DisplayDropdown() {
    document.getElementsByClassName("container")[0].style.visibility = "visible"; //display dropdown
  }
  VanishDropdown() {
    document.getElementsByClassName("container")[0].style.visibility = "hidden"; //vanish dropdown
  }


  addPokemonImage(pokemonObj) {
    const url = pokemonObj.sprites.front_default;
    document.getElementById('imageNBA').setAttribute('src', url);
    document.getElementsByClassName('NbaImage')[0].style.visibility = "visible"
    const spinning = [
      { transform: 'rotate(0deg) scale(0)' },
      { transform: 'rotate(0) scale(1)' }

    ];
    const timing = {
      duration: 2000,
      iterations: 1,
    }
    document.getElementById('imageNBA').animate(spinning, timing);
    setTimeout(() => {
      const spinning = [
        { transform: 'rotate(0) scale(1)' },
        { transform: 'rotate(0deg) scale(0)' }
      ];
      const timing = {
        duration: 2000,
        iterations: 1,
      }
      document.getElementById('imageNBA').animate(spinning, timing);
      setTimeout(() => { document.getElementsByClassName('NbaImage')[0].style.visibility = "hidden" }, 500)
    }, 2000);
  }

  getPokemonObjectByName(taskList, taskObjectName) {
    let pokemonObj = null;
    const pokemonName = taskObjectName.split(' ');
    taskList.forEach(task => {
      if (task.isPokemon === true) {
        if (task.item.name === pokemonName[1]) {
          pokemonObj = task.item;
        }
      }
    })

    return pokemonObj;
  }
  handleCountTask() {
    const numTasks = document.getElementById("my-ul").childElementCount;
    const count = document.getElementById("count");

    if (numTasks === 0) {
      count.style.visibility = "hidden";
    } else {
      count.innerText = `you have ${numTasks} tasks`;
      count.style.visibility = "visible";

    }
  }


  createCheckBox(status,id,li)
  {

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = status;
    checkbox.id= id;
    this.addOnClickMehodToCheckBox(checkbox,li);
    return checkbox;
  }



  addOnClickMehodToCheckBox(checkbox,li)
  {

    checkbox.addEventListener('change', async(e) => {
        const state = e.target.checked;
        await this.itemClient.updateStatus(e.target.id,state);
        this.CheckedTask(li,state);

    });
  }

}










