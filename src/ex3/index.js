import { Command } from "commander";
import ItemManager from "./ItemManager.js";
import inquirer from "inquirer";
const itemManger = new ItemManager();

inquirer
  .prompt([
    {
      type:'list', 
      name:'list',
      message: 'pick from the options',
      choices:['Add a new task','See your current tasks','Delete task']
    }
  ])
  .then((answers) => {
    if(answers.list == 'Add a new task')
    {
      inquirer.prompt([{
        type:'input', 
        name:'add',
        message: 'add your new task'}
       

      ]).then((answers)=>{
        itemManger.addItem(answers.add)
      })
      
    }
    else if(answers.list =='See your current tasks'){
       itemManger.getTaskList();
    }

    else{
      inquirer.prompt([{
        type:'input', 
        name:'delete',
        message: 'please put your task id that you want to delete',
        validate:(answer) =>{
          if(isNaN(answer)){
            return 'please enter a valid number'
          }
          return true;

        }
      }
       

      ]).then((answers)=>{
        itemManger.DeleteTask(answers.delete)
      })

    }
    
  })

  // I implement Inquirer and Commander both, to use commander activate lines 94-95 and note the above code.

function getCommanderProgram() {
  const program = new Command();
  

  program
    .name("to-do")
    .description("Use the pokemon todo app to insert tasks!")
    .version("1.0.0");

  program
    .command("add")
    .description("Adding task to the list")
    .argument("<string>", "Task name")
    .action(async (taskName, options) => {
      await itemManger.addItem(taskName);
    });

  program
    .command("delete")
    .description("removing task to the list")
    .argument("<number>", "Task Index")
    .action(async(taskIndex) => {
     await  itemManger.DeleteTask(taskIndex);
    });

  program
    .command("get")
    .description("print the task list into the Cli")
    .action(async() => {
      await itemManger.getTaskList();
    });
  return program;
}



//  const program = getCommanderProgram();
//  program.parse();


