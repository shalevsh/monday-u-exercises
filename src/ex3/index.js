import { Command } from "commander";
import ItemManager from "./ItemManager.js";

function getCommanderProgram() {
  const program = new Command();
  const itemManger = new ItemManager();

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

const program = getCommanderProgram();
program.parse();


