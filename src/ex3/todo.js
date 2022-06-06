
import fetch from "node-fetch";
import chunck from "node-fetch";
import { Command } from "commander";
import  ItemManager  from "./ItemManager.js";


function getCommanderProgram() {
  const program = new Command();

  program
    .name("to-do")
    .description("Use the pokemon todo app to insert tasks!")
    .version("1.0.0");

  program
    .command("add-task")
    .description("Adding task to the list")
    .argument("<string>", "Task name")
    // .option("-s, --scale <string>", SCALE_ARG_DESCRIPTION, SCALES.CELSIUS)
    .action(async (taskName, options) => {
        ItemManager.addItem(taskName);
    });

    program
    .command("remove-task")
    .description("removing task to the list")
    .action(() => {
      console.log(
        `todo list-`
      );
    });

  program
    .command("get-detailed-task-list")
    .description("print the task list into the Cli")
    .action(() => {
      console.log(
        `todo list-`
      );
    });






  return program;
}

const program = getCommanderProgram();
program.parse();


