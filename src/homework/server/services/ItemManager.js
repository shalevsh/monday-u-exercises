const pokemonClient = require("../clients/PokemonClient.js");
const {Item, Sequelize} = require("../db/models")
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
    this.taskList = await Item.findAll({raw:true});
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
      return this.newItems;
    }

    await Item.bulkCreate(this.newItemsForTable);
    return this.newItems[(this.newItems.length)-1];
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
  }
  
  async getTaskList() {
    this.taskList = await Item.findAll({raw:true}); // with id property 
    return this.taskList;
  }

  async sortItems() {
     this.taskList = await Item.findAll({raw:true});
     this.taskList.reverse();
    //await fs.writeFile("./todoDB.json",JSON.stringify(this.taskList));
    return this.taskList;
  }

  async DeleteTask(index) {
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
 
async deleteAllItems(){
  this.taskList =[];
  this.newItems = [];
  await Item.destroy({
    where: {},
    truncate: true,
    restartIdentity: true,
  });
}
async updateStatus(id){
await Item.update({
'status': Sequelize.literal('NOT status')},
{where: {'id' : id.id}},

)
return true;
}

}

module.exports = new ItemManager();
