const pokemonClient = require("../clients/PokemonClient.js");
const {Item} = require("../db/models")
const fs = require("fs").promises;
class ItemManager {
  constructor() {
    this.taskList = [];
    this.newItems = [];
    this.newItemsForTable=[];

  }

  async addItem(item) {
    this.newItems = [];
    this.newItemsForTable=[];
    try{
      this.taskList = await Item.findAll({raw:true});
      //let data =  await fs.readFile("todoDB.json")
      //this.taskList = JSON.parse(data);
      
      
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
       //  ArrWithoutDuplicates = this.getItemsToAdd(arrOfPokemonsID);
        if (pokemonObj) {
          pokemons=[pokemonObj];
          const pokemonObjForTable = { isPokemon: true, item: pokemonObj.name, isDisplay: false, status: false }
          this.newItemsForTable.push(pokemonObjForTable);
          const pokemonObject= { isPokemon: true, item: pokemonObj, isDisplay: false, status: false }
          this.newItems.push(pokemonObject);
        } else {
          pokemons = await pokemonClient.fetchPokemon(arrOfPokemonsID);
          pokemons.forEach((pokemon) => {
            const pokemonObjForTable = { isPokemon: true, item: pokemon.name, isDisplay: false, status: false }
            this.newItemsForTable.push(pokemonObjForTable);
            const pokemonObj= { isPokemon: true, item: pokemon, isDisplay: false, status: false }
            this.newItems.push(pokemonObj);
          })
        }
        this.taskList = this.taskList.concat(
          pokemons.map((pokemon) => {
            const obj = { isPokemon: true, item: pokemon, isDisplay: false, status: false }
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
      this.taskList.push({ isPokemon: false, item: item ,isDisplay: false, status: false});
      this.newItems.push({ isPokemon: false, item: item ,isDisplay: false, status: false});
      await Item.bulkCreate(this.newItems);
      await this.saveFullTaskList();
      return this.newItems;
    }

    await Item.bulkCreate(this.newItemsForTable);
    await this.saveFullTaskList();
    return this.newItems;
  }


   async saveFullTaskList() {
    try{
     await fs.writeFile("./todoDB.json", JSON.stringify(this.taskList))
    }catch(err){
    
    }
  }


  getItemsToAdd(arrOfNamesTasks) {
    const pokemonsArr = this.taskList.filter((task) => task.isPokemon == true).map((pokemon) => pokemon.item);
    const ArrWithoutDuplicates = arrOfNamesTasks.filter((name) => !pokemonsArr.includes(name));
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
    this.taskList = await Item.findAll({raw:true});
    //this.taskList = await this.jsonReader("./todoDB.json")

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
    this.taskList = await Item.findAll({raw:true}); // with id property 
    return this.taskList;
  }

  async sortItems() {
    //this.taskList = await this.jsonReader("./todoDB.json");
    // this.taskList = await Item.findAll({raw:true});
    // this.taskList.reverse();
    //await fs.writeFile("./todoDB.json",JSON.stringify(this.taskList));
    return this.taskList;
  }

  async DeleteTask(index) {
  //this.taskList = await Item.findAll({raw:true});
  // this.taskList = await this.jsonReader("./todoDB.json")
  
  try {
    await Item.destroy({ where: { id: index+1 } });
    const res = await Item.findAndCountAll();
    console.log(res,"res")
      if(res.count == 0){
        await Item.destroy({
          where: {},
          truncate: true,
          restartIdentity: true,
        });
      } 
    
  } catch (err) {
  throw `There is no task with id: ${index+1} `;
  }
}
 
  async jsonReader(filePath) {
    try{
      let data =  await fs.readFile(filePath)
      let tasks = JSON.parse(data);
      //let tasks = await Item.findAll({raw:true});
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
  await Item.destroy({
    where: {},
    truncate: true,
    restartIdentity: true,
  });
}

}

module.exports = new ItemManager();
