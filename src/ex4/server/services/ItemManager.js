import PokemonClient from "../clients/PokemonClient.js";
import {promises as fs} from "fs";
class ItemManager {
  constructor() {
    this.taskList = [];
    this.pokemonClinet = new PokemonClient();

  }

  async addItem(item) {
    console.log(item);

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
            console.log(obj)
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
      return this.taskList[this.taskList.length-1];
    }
    await this.saveFullTaskList();
    return this.taskList[this.taskList.length-1];
  }


   async saveFullTaskList() {
    try{
     await fs.writeFile("./todoDB.json", JSON.stringify(this.taskList))
    }catch(err){
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
       }catch(err){
       }
      }
  
  async getTaskList() {
    this.taskList = await this.jsonReader("./todoDB.json")
     
      if (this.taskList.length === 0) {
      }
      else {
        for (let index = 0; index < this.taskList.length; index++) {
          const element = this.taskList[index];
        }
      }
  }

  async DeleteTask(index) {
  this.taskList = await this.jsonReader("./todoDB.json")
  if(this.taskList.length === 0)
  {
    return;

  }
        if(!this.taskList.indexOf(index))
        {
          return;
        }
        this.taskList.splice(index, 1);
        try{
        await fs.writeFile("./todoDB.json", JSON.stringify(this.taskList));
        }
      catch(err){
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


export default new ItemManager;

