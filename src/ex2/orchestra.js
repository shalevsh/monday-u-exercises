const TYPE_DEADLINE = 1
const TYPE_NOTCOMPLETE = 2
const TYPE_FINISHED = 3
const TYPE_DEADLINE_FINISHED = 4
const SORT_ALPHABATICALLY = 1;
const SORT_DEADLINE = 2;
const SORT_NOTCOMPLETE = 3;
const SORT_FINISHED = 4;

class Orchestra{
    constructor() {
        this.TaskList =[];
    }

    renderItem(taskList){
    this.addTaskWatcher();
    const filterTaskList=taskList.filter((element) => element.isDisplay === false)
     filterTaskList.forEach(element => {
      let taskName;
      if(element.isPokemon === false){
         taskName = element.item
        element.isDisplay=true;
      }else{
        taskName = element.item.name; 
        element.isDisplay=true;
      }
      const isPokemon = element.isPokemon
       this.CreateNewListItemElement(taskName,taskList,isPokemon);
     });
    }
    
    addTaskWatcher() {
        setInterval(() => {
            let deadLineReachedTask = this.TaskList.filter(x => x.type == TYPE_DEADLINE).filter(x => x.datetime < new Date());
            if (deadLineReachedTask && deadLineReachedTask.length > 0) {
                let ids = deadLineReachedTask.map(x => x.id);
                for (let index = 0; index < ids.length; index++) {
                    const liId = ids[index];
                    let task = getTask(liId);
                    this.updateTask(task.id, TYPE_DEADLINE_FINISHED, task.name, task.datetime, task.isAnimated);
                    this.bindTaskList(false);

                }
            }

        }, 1000)
    }

     addTask(type, name, date,isPokemon) {
        let id = this.getId();
        if(isPokemon === true){
          name ="Catch "+  name  ;
          }   
        this.TaskList.push({ id: id, type: type, name: name, datetime: date, createDateTime: new Date(), isAnimated: true });
        return id;
      }
     CreateNewListItemElement(taskString,taskList,isPokemon) {
        if (taskString === '') {
          alert("You must write something!");
        } else {
          this.addTask(TYPE_NOTCOMPLETE,taskString, null,isPokemon);
          this.bindTaskList(false,taskList)
        }
      }

       getId() {
        if (this.TaskList.length == 0) {
          return 1;
        }
        const latestId = this.TaskList.map(x => x.id).sort((p, c) => c - p);
        return latestId[0] + 1;
      
      }
 getTask(id) {
  return this.TaskList.filter(x => x.id == id)[0]
}

 updateTask(id, type, name, date, isAnimated) {
  let indexFound = 0;
  let createDateTime = new Date();
  for (let index = 0; index < this.TaskList.length; index++) {
    let element = this.TaskList[index];
    if (element.id == id) {
      createDateTime = element.createDateTime;
      indexFound = index;
      break;
    }
  }

  this.TaskList[indexFound] = { id: id, type: type, name: name, datetime: date, createDateTime: createDateTime, isAnimated: isAnimated };
}

 bindTaskList(withSort,taskList) {
  let sortedList = this.getSortedTaskList(withSort);
  if (sortedList.length > 0) {
    document.getElementById("myUL").innerHTML = "";
    for (let index = 0; index < sortedList.length; index++) {
      const LiObject = sortedList[index];
      this.CreateNewListItemElementByTaskObject(LiObject,taskList)
    }
  }

}

 getSortedTaskList(withSort) {    
  let sortTaskList = []
  let sortBy = document.getElementById('sortDropdown').value
  if (this.TaskList.some(x => x.type == TYPE_DEADLINE_FINISHED)) {
    sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type == TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.datetime.getTime() - a.datetime.getTime(); }));
  }
  if (withSort) {
    if (sortBy == SORT_ALPHABATICALLY) {
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
      }));
    }
    else if (sortBy == SORT_DEADLINE) {
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type == TYPE_DEADLINE).sort((a, b) => { return a.datetime.getTime() - b.datetime.getTime(); }));
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type != TYPE_DEADLINE && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }
    else if (sortBy == SORT_FINISHED) {
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type == TYPE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type != TYPE_FINISHED && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }

    else if (sortBy == SORT_NOTCOMPLETE) {
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type == TYPE_NOTCOMPLETE).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
      sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type != TYPE_NOTCOMPLETE && x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
    }
  }
  else {
    sortTaskList = sortTaskList.concat(this.TaskList.filter(x => x.type != TYPE_DEADLINE_FINISHED).sort((a, b) => { return b.createDateTime.getTime() - a.createDateTime.getTime(); }));
  }
  return sortTaskList;
}

  CreateNewListItemElementByTaskObject(taskObject,taskList) {

  // Create a new list item when clicking on the "Add" button
  const li = document.createElement("li");   //create new list item html element  
  const textElement = document.createTextNode(taskObject.name); // create text html element with user task input name
  // if user task input name is empty string, show it at alert dialog, else append the LI element to UL.

  li.setAttribute("id", `task${taskObject.id}`);
  li.setAttribute("taskId", `${taskObject.id}`);

  this.DisplayDropdown(); //display dropdown
  this.VanishEmptyTaskFloatMassage();
  li.appendChild(textElement); // append text element to list item element
  document.getElementById("myUL").appendChild(li);
  if (taskObject.isAnimated) {
    this.AnimateListAdd(li);
    this.updateTask(taskObject.id, taskObject.type, taskObject.name, taskObject.datetime, false)
  }
  this.DisplayInvisibleButtons(); // display sort and clear all buttons
  li.addEventListener("click", ({ target }) => {
  this.CheckedTask(target, false); // mark task for complete status
  });
  this.CreateRemoveItemFromList(li,taskList,taskObject.id);
  this.addCalendarIcon(li, taskObject.datetime);
  if (taskObject.type == TYPE_FINISHED) {
    this.CheckedTask(li, true)
  }
  else if (taskObject.type == TYPE_DEADLINE_FINISHED) {
    li.classList.add('markDeadline');
  }

}

 randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

 CheckedTask(target, withSort) {
  console.log(target.tagName);
  if (target.tagName == "INPUT" || target.tagName == "BUTTON") {
    return;
  }
  // Add a "checked" symbol when clicking on a list item
  if (!target.classList.contains('checked')) {
    const id = target.getAttribute('taskId')
    let taskObject = this.getTask(id);
    this.updateTask(taskObject.id, TYPE_FINISHED, taskObject.name, taskObject.datetime, false)
    if (!withSort) {
      this.rotateImage();
    }

  }
  else {
    let taskObject = this.getTask(target.getAttribute('taskId'));
    this.updateTask(taskObject.id, TYPE_NOTCOMPLETE, taskObject.name, taskObject.datetime, false)
  }
  target.classList.toggle('checked');
}


 sortList() {
  this.bindTaskList(true);
}

 clearList() {
   this.TaskList=[];
  this.VanishvisibleButtons();
  this.DisplayEmptyTaskFloatMassage();
  document.getElementById("myUL").innerHTML = "";
}

 VanishvisibleButtons() {
  const sortButton = document.getElementById("sortBtn");
  const clearButton = document.getElementById("clearBtn");
  sortButton.style.visibility = "hidden";
  clearButton.style.visibility = "hidden";
  this.VanishDropdown();
}
 DisplayInvisibleButtons() {
  const sortButton = document.getElementById("sortBtn");
  const clearButton = document.getElementById("clearBtn");
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


 removeItem(li,taskList,id) {
   taskList[id-1] = undefined;
  li.remove();
}

 
  CreateRemoveItemFromList(li,taskList,id) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  span.onclick =  () => {
    const spinning = [
    { transform: 'rotate(0) scale(1)' },
    { transform: 'rotate(0deg) scale(0)' }
  ];
  const timing = {
    duration: 1000,
    iterations: 1,
  }
  li.animate(spinning, timing);
  const id =li.getAttribute('taskId');
  this.TaskList = this.TaskList.filter(x => x.id != id);

  setTimeout(this.removeItem, 1000, li,taskList,id)
  const ul = document.getElementById("myUL");   //extract user task input string name
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
  input.onchange =  ()=> {
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
 rotateImage() {
  // let randomNo = this.randomIntFromInterval(1, 75);
  // let imagePath = `images/${randomNo}.jpg`
  // document.getElementById('imageNBA').setAttribute('src', imagePath);
  // document.getElementsByClassName('NbaImage')[0].style.visibility = "visible"
  // const spinning = [
  //   { transform: 'rotate(0deg) scale(0)' },
  //   { transform: 'rotate(0) scale(1)' }

  // ];
  // const timing = {
  //   duration: 2000,
  //   iterations: 1,
  // }
  // document.getElementById('imageNBA').animate(spinning, timing);
  // setTimeout(() => {
  //   const spinning = [
  //     { transform: 'rotate(0) scale(1)' },
  //     { transform: 'rotate(0deg) scale(0)' }
  //   ];
  //   const timing = {
  //     duration: 2000,
  //     iterations: 1,
  //   }
  //   document.getElementById('imageNBA').animate(spinning, timing);
  //   setTimeout(() => { document.getElementsByClassName('NbaImage')[0].style.visibility = "hidden" }, 500)
  // }, 2000);
}


}export default Orchestra;










