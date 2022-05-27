const TYPE_DEADLINE = 1
const TYPE_NOTCOMPLETE = 2
const TYPE_FINISHED = 3
const TYPE_DEADLINE_FINISHED = 4
const SORT_ALPHABATICALLY = 1;
const SORT_DEADLINE = 2;
const SORT_NOTCOMPLETE = 3;
const SORT_FINISHED = 4;

let TaskList = [];

MainFunction();

function MainFunction() {
  AddTaskByEnter();
  addTaskWatcher()
}

function addTaskWatcher() {
  setInterval(() => {
    let deadLineReachedTask = TaskList.filter(x => x.type == TYPE_DEADLINE).filter(x => x.datetime < new Date());
    if (deadLineReachedTask && deadLineReachedTask.length > 0) {
      let ids = deadLineReachedTask.map(x => x.id);
      for (let index = 0; index < ids.length; index++) {
        const liId = ids[index];
        let task = getTask(liId);
        updateTask(task.id, TYPE_DEADLINE_FINISHED, task.name, task.datetime, task.isAnimated);
        bindTaskList(false);

      }
    }

  }, 1000)
}
function addTask(type, name, date) {
  let id = getId();
  TaskList.push({ id: id, type: type, name: name, datetime: date, createDateTime: new Date(), isAnimated: true });
  return id;
}

function updateTask(id, type, name, date, isAnimated) {
  let indexFound = 0;
  let createDateTime = new Date();
  for (let index = 0; index < TaskList.length; index++) {
    let element = TaskList[index];
    if (element.id == id) {
      createDateTime = element.createDateTime;
      indexFound = index;
      break;
    }
  }

  TaskList[indexFound] = { id: id, type: type, name: name, datetime: date, createDateTime: createDateTime, isAnimated: isAnimated };
}
function getLastTaskId() {
  TaskList.sort((a, b) => b.getTime() - a.getTime())[0].id;
}
function removeTask(id) {
  TaskList = TaskList.filter(x => x.id != id);
}


function getTask(id) {
  return TaskList.filter(x => x.id == id)[0]
}

function getId() {
  if (TaskList.length == 0) {
    return 1;
  }
  let latestId = TaskList.map(x => x.id).sort((p, c) => c - p);
  return latestId[0] + 1;

}

function rotateImage() {
  let randomNo = randomIntFromInterval(1, 75);
  let imagePath = `images/${randomNo}.jpg`
  document.getElementById('imageNBA').setAttribute('src', imagePath);
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

function CreateNewListItemElement() {
  const inputValue = document.getElementById("myInput").value;   //extract user task input string name

  if (inputValue === '') {
    alert("You must write something!");
  } else {
    let insertedId = addTask(TYPE_NOTCOMPLETE, inputValue, null);
    document.getElementById("myInput").value = "";//rename the text input to empty string
    bindTaskList(false)
  }
}

function bindTaskList(withSort) {
  let sortedList = getSortedTaskList(withSort);
  if (sortedList.length > 0) {
    document.getElementById("myUL").innerHTML = "";
    for (let index = 0; index < sortedList.length; index++) {
      const LiObject = sortedList[index];
      CreateNewListItemElementByTaskObject(LiObject, withSort)
    }
  }

}

function getSortedTaskList(withSort) {
  let sortTaskList = []
  let sortBy = document.getElementById('sortDropdown').value
  if (TaskList.some(x => x.type == TYPE_DEADLINE_FINISHED)) {
    sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type == TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.datetime.getTime() - a.datetime.getTime(); }));
  }
  if (withSort) {
    if (sortBy == SORT_ALPHABATICALLY) {
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
      }));
    }
    else if (sortBy == SORT_DEADLINE) {
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type == TYPE_DEADLINE).sort((a, b) => { return b.datetime.getTime() - a.datetime.getTime(); }));
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type != TYPE_DEADLINE && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }
    else if (sortBy == SORT_FINISHED) {
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type == TYPE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type != TYPE_FINISHED && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }

    else if (sortBy == SORT_NOTCOMPLETE) {
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type == TYPE_NOTCOMPLETE).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type != TYPE_NOTCOMPLETE && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }
  }
  else {
    sortTaskList = sortTaskList.concat(TaskList.filter(x => x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
  }
  return sortTaskList;
}

function CreateNewListItemElementByTaskObject(taskObject, withSort) {

  // Create a new list item when clicking on the "Add" button
  const li = document.createElement("li");   //create new list item html element  
  const textElement = document.createTextNode(taskObject.name); // create text html element with user task input name
  // if user task input name is empty string, show it at alert dialog, else append the LI element to UL.

  li.setAttribute("id", `task${taskObject.id}`);
  li.setAttribute("taskId", `${taskObject.id}`);

  DisplayDropdown(); //display dropdown
  VanishEmptyTaskFloatMassage();
  li.appendChild(textElement); // append text element to list item element
  document.getElementById("myUL").appendChild(li);
  if (taskObject.isAnimated) {
    AnimateListAdd(li);
    updateTask(taskObject.id, taskObject.type, taskObject.name, taskObject.datetime, false)
  }
  DisplayInvisibleButtons(); // display sort and clear all buttons
  li.addEventListener("click", ({ target }) => {
    CheckedTask(target, false); // mark task for complete status
  });
  CreateRemoveItemFromList(li);
  addCalendarIcon(li, taskObject.datetime);
  if (taskObject.type == TYPE_FINISHED) {
    CheckedTask(li, true)
  }
  else if (taskObject.type == TYPE_DEADLINE_FINISHED) {
    li.classList.add('markDeadline');
  }


}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function CheckedTask(target, withSort) {
  console.log(target.tagName);
  if (target.tagName == "INPUT" || target.tagName == "BUTTON") {
    return;
  }
  // Add a "checked" symbol when clicking on a list item
  if (!target.classList.contains('checked')) {
    let taskObject = getTask(target.getAttribute('taskId'));
    updateTask(taskObject.id, TYPE_FINISHED, taskObject.name, taskObject.datetime, false)
    if (!withSort) {
      rotateImage();
    }

  }
  else {
    let taskObject = getTask(target.getAttribute('taskId'));
    updateTask(taskObject.id, TYPE_NOTCOMPLETE, taskObject.name, taskObject.datetime, false)
  }
  target.classList.toggle('checked');
}

function AddTaskByEnter() {
  document.getElementById("myInput")
    .addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        document.getElementById("addBtn").click();
      }
    });
}

function SortList() {
  bindTaskList(true);
}

function ClearList() {
  TaskList = [];
  VanishvisibleButtons();
  DisplayEmptyTaskFloatMassage();
  document.getElementById("myUL").innerHTML = "";
}

function VanishvisibleButtons() {
  const sortButton = document.getElementById("sortBtn");
  const clearButton = document.getElementById("clearBtn");
  sortButton.style.visibility = "hidden";
  clearButton.style.visibility = "hidden";
  VanishDropdown();
}
function DisplayInvisibleButtons() {
  const sortButton = document.getElementById("sortBtn");
  const clearButton = document.getElementById("clearBtn");
  sortButton.style.visibility = "visible";
  clearButton.style.visibility = "visible";
}

function AnimateListItemDelete(li) {
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

function AnimateListAdd(li) {
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
function VanishEmptyTaskFloatMassage() {
  const floating = document.getElementById("floating_square");
  floating.style.visibility = "hidden";
}
function DisplayEmptyTaskFloatMassage() {
  const floating = document.getElementById("floating_square");
  floating.style.visibility = "visible";
}
function removeItem(li) {
  removeTask(li.getAttribute('taskId'))
  li.remove();
}
function CreateRemoveItemFromList(li) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  span.onclick = function () {
    AnimateListItemDelete(li);
    setTimeout(removeItem, 100, li);
    const ul = document.getElementById("myUL");   //extract user task input string name
    if (ul.childElementCount === 1) {
      VanishvisibleButtons();
      DisplayEmptyTaskFloatMassage();
    }
  }
}

function addCalendarIcon(li, deadLineText) {
  const input = document.createElement("input");
  input.setAttribute('type', "datetime-local")
  input.className = "calendarIcon";
  input.onchange = function () {
    console.log(new Date(input.value));
    let task = getTask(li.getAttribute("taskId"));
    updateTask(task.id, TYPE_DEADLINE, task.name, new Date(input.value), task.isAnimated)
    input.nextElementSibling.innerHTML = new Date(input.value);
  }
  input.onclick = function () {
    input.nextElementSibling.nextElementSibling.style.display = "block";
  }
  input.onblur = function () {
    console.log("blur")
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

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      // padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
    ].join(':')
  );
}
function DisplayDropdown() {
  document.getElementsByClassName("container")[0].style.visibility = "visible"; //display dropdown
}
function VanishDropdown() {
  document.getElementsByClassName("container")[0].style.visibility = "hidden"; //vanish dropdown

}