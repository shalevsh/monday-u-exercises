import PokemonClient from "./PokemonClient.js";
import {promises as fs} from "fs";
import asciifyImage from 'asciify-image';
import chalk from "chalk";
export default class ItemManager {
  constructor() {
    this.taskList = [];
    this.pokemonClinet = new PokemonClient();

  }

  async addItem(item) {
    try{
      let data =  await fs.readFile("todoDB.json")
      this.taskList = JSON.parse(data);
      
    }
    catch(err)
    {
      await fs.writeFile("todoDB.json",JSON.stringify(this.taskList))

    }
    const pokemonObj = await this.pokemonClinet.checkByPokemonName(item);
    const { isPokemon, arrOfPokemonsID } = this.isPokemon(item);

    if (isPokemon || pokemonObj) {
      let ArrWithoutDuplicates;
      let pokemons;
      try {
        if (isPokemon) {
          ArrWithoutDuplicates = this.getItemsToAdd(arrOfPokemonsID);
        }
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
    await this.saveFullTaskList();
  }


   async saveFullTaskList() {
    try{
     await fs.writeFile("./todoDB.json", JSON.stringify(this.taskList))
     console.log(chalk.green("New todo added successfully"));
    }catch(err){
      console.log(chalk.red("Error writing file:", err));
    }
  }


  getItemsToAdd(arrOfTasks) {
    const pokemonsIdArr = this.taskList
      .filter((task) => task.isPokemon)
      .map((pokemon) => pokemon.item.id.toString());
    const ArrWithoutDuplicates = arrOfTasks.filter((id) => !pokemonsIdArr.includes(id));
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

  async loadTaskList() {
    this.taskList = await this.jsonReader("./todoDB.json")

  }

   async addTask(taskName) {
   this.taskList = await  this.jsonReader("./todoDB.json")
      // increase customer order count by 1
      taskArray.push(taskName);
      try{
       await fs.writeFile("./todoDB.json", JSON.stringify(taskArray))
       console.log(chalk.green("New todo added successfully"));
       }catch(err){
        console.log(chalk.red("Error writing file:", err));
       }
      }
  
  async getTaskList() {
    this.taskList = await this.jsonReader("./todoDB.json")
     
      if (this.taskList.length === 0) {
        console.log(chalk.redBright("No task found"));
      }
      else {
        for (let index = 0; index < this.taskList.length; index++) {
          const element = this.taskList[index];
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
  }

  async DeleteTask(index) {
  this.taskList = await this.jsonReader("./todoDB.json")
  if(this.taskList.length === 0)
  {
    console.log(chalk.red('your list is empty'))
    return;

  }
        if(!this.taskList.indexOf(index))
        {
          console.log(chalk.red(`item with index: ${index} doesn't exsit`))
          return;
        }
        this.taskList.splice(index, 1);
        try{
        await fs.writeFile("./todoDB.json", JSON.stringify(this.taskList));
        console.log(chalk.red("Todo deleted successfully"));
        }
      catch(err){
        console.log(chalk.red("Item doesn't exist"));      
        }
      }
 
  async jsonReader(filePath) {
    try{
      let data =  await fs.readFile(filePath)
      let tasks = JSON.parse(data);
      return tasks;
    }
    catch(err)
    {
      await fs.writeFile(filePath,JSON.stringify(this.taskList))
      return this.taskList

    }
}
}


