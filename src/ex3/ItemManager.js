import PokemonClinet from "./PokemonClient.js";
import fs from "fs";
import asciifyImage from 'asciify-image';
import chalk from "chalk";
export default class ItemManager {
  constructor() {
    this.taskList = [];
    this.pokemonClinet = new PokemonClinet();

  }

  async addItem(item) {
    this.loadTaskList();
    const pokemonObj = await this.pokemonClinet.checkByPokemonName(item);
    const { isPokemon, arrOfPokemonsID } = this.isPokemon(item);

    if (isPokemon || pokemonObj) {
      let ArrWithoutDuplicates;
      let pokemons;
      let isPokimonObjectExists;

      try {
        if (isPokemon) {
          ArrWithoutDuplicates = this.getItemsToAdd(arrOfPokemonsID);
        }
        // else{
        //   isPokimonObjectExists = this.getItemsToAddFromObject(pokemonObj);
        // }
        if (pokemonObj) {
          pokemons = [pokemonObj];
        } else {
          pokemons = await this.pokemonClinet.fetchPokemon(ArrWithoutDuplicates);
        }
        this.taskList = this.taskList.concat(
          pokemons.map((pokemon) => {
            const obj = { isPokemon: true, item: pokemon, isDisplay: false }
            return obj
          })
        );
      } catch (exception) {
        let res = "";
        ArrWithoutDuplicates.forEach(elem => {
          res += elem + " ";

        });
      }
    } else {
      this.taskList.push({ isPokemon: false, item: item });
    }
    this.taskList = this.taskList.filter(elem => { return elem !== undefined });
    this.saveFullTaskList();
  }


  saveFullTaskList() {
    fs.writeFile("./todoDB.json", JSON.stringify(this.taskList), err => {
      if (err) console.log(chalk.red("Error writing file:", err));
      else console.log(chalk.green("New todo added successfully"));
    });
    // jsonReader("./todoDB.json", (err, taskArray) => {
    //   if (err) {
    //     console.log("Error reading file:", err);
    //     return;
    //   }
    //   // increase customer order count by 1
    //   taskArray.push(taskName);
    //   fs.writeFile("./todoDB.json", JSON.stringify(taskArray), err => {
    //     if (err) console.log("Error writing file:", err);
    //     else console.log("New todo added successfully");
    //   });
    // });
  }


  getItemsToAdd(arr) {
    const pokemonsIdArr = this.taskList
      .filter((obj) => obj.isPokemon)
      .map((obj) => obj.item.id.toString());
    const ArrWithoutDuplicates = arr.filter((id) => !pokemonsIdArr.includes(id));
    return ArrWithoutDuplicates;
  }

  isPokemon(item) {
    const arr = item.split(/\s*,\s*/);
    let flag = false;
    arr.forEach((element) => {
      if (!this.isNum(element)) {
        return;
      }
      flag = true;
    });
    return { isPokemon: flag, arrOfPokemonsID: arr };
  }

  isNum(val) {
    return !isNaN(val);
  }

  loadTaskList() {
    this.jsonReader("./todoDB.json", (err, taskArray) => {
      this.taskList = [];
      if (err) {

        return [];
      }
      this.taskList = taskArray;
    });
  }

  addTask(taskName) {
    this.jsonReader("./todoDB.json", (err, taskArray) => {
      if (err) {
        console.log(chalk.red("Error reading file:", err));
        return;
      }
      // increase customer order count by 1
      taskArray.push(taskName);
      fs.writeFile("./todoDB.json", JSON.stringify(taskArray), err => {
        if (err) console.log(chalk.red("Error writing file:", err));
        else console.log(chalk.green("New todo added successfully"));
      });
    });
  }
  getTaskList() {
    this.jsonReader("./todoDB.json", (err, taskArray) => {
      if (err) {
        console.log(chalk.red("Error reading file:", err));
        return;
      }
      if (taskArray.length == 0) {
        console.log(chalk.redBright("No task found"));
      }
      else {
        for (let index = 0; index < taskArray.length; index++) {
          const element = taskArray[index];
          if (element.isPokemon) {
            console.log(chalk.green(`Catch ${element.item.name}`));
            asciifyImage(element.item.sprites.front_default,{fit:"original"},(err,pokemonImage) =>{
                console.log(pokemonImage);
              }
            );
          }
          else {
            console.log(element.item);
          }

        }
      }

    });
  }

  DeleteTask(index) {
    this.jsonReader("./todoDB.json", (err, taskArray) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }

      if (typeof taskArray[index] === 'undefined') {
        console.log("Error in reading file")
      }
      else {
        // does exist

        taskArray.splice(index, 1);
        fs.writeFile("./todoDB.json", JSON.stringify(taskArray), err => {
          if (err) console.log("Error writing file:", err);
          else console.log("Todo deleted successfully")
        });
      }
    });
  }
  jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }

}


// module.exports = {
//   ItemManager: ItemManager,

// };
