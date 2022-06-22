const pokemonClient = require("../clients/PokemonClient.js");
const {Item} = require("../db/models")
const fs = require("fs").promises;
class ItemManager {
  constructor() {
    this.taskList = [];
    this.newItems = [];

  }

  async addItem(item) {
    this.newItems = [];
    try{
      let data =  await fs.readFile("todoDB.json")
      this.taskList = JSON.parse(data);
      
      
    }
    catch(err)
    {
      await fs.writeFile("todoDB.json",JSON.stringify([]))

    }
    const pokemonObj = await pokemonClient.checkByPokemonName(item);
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
          this.newItems.push(pokemonObj);
        } else {
          pokemons = await pokemonClient.fetchPokemon(ArrWithoutDuplicates);
          pokemons.forEach((pokemon) => {
            const pokemonObj = { isPokemon: true, item: pokemon, isDisplay: false }
            this.newItems.push(pokemonObj);
          })
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
      this.taskList.push({ isPokemon: false, item: item ,isDisplay: false});
      await Item.bulkCreate(this.newItems);
      //this.taskLis = Item.findAll({raw:true});
      await this.saveFullTaskList();
      return this.taskList[this.taskList.length-1];
    }
    await this.saveFullTaskList();
    return this.newItems;
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
      this.taskList.push(taskName);
      try{
        await fs.writeFile("./todoDB.json", JSON.stringify(taskArray))
      }catch(err){
        await fs.writeFile('./todoDB.json',JSON.stringify([]));
      }

      }
  
  async getTaskList() {
    this.taskList = await this.jsonReader("./todoDB.json")
    return this.taskList;
  }

  async sortItems() {
    this.taskList = await this.jsonReader("./todoDB.json");
    this.taskList.reverse();
    await fs.writeFile("./todoDB.json",JSON.stringify(this.taskList));
    return this.taskList;
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

async deleteAllItems(){
  this.taskList =[];
  this.newItems = [];
  
  fs.writeFile('./todoDB.json', JSON.stringify(this.taskList),function(err){
    if(err){
      return false;
    }
    return true;
  });
}

}

module.exports = new ItemManager();
