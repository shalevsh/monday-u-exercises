import PokemonClinet from "./PokemonClient.js";
import Orchestra from "./orchestra.js";

class ItemManager {
  constructor() {
    this.taskList = [];
    this.pokemonClinet = new PokemonClinet();
    this.Orchestra = new Orchestra();
  }

  async addItem(item) {
    this.updateDeletedTaskInArray();
    console.log(this.taskList);
    const pokemonObj = await this.pokemonClinet.checkByPokemonName(item);
    const { isPokemon, arrOfPokemonsID } = this.isPokemon(item);

    if (isPokemon||pokemonObj) {
      let ArrWithoutDuplicates;
      let pokemons;
      let isPokimonObjectExists;
      
      try {
        if(isPokemon){
          ArrWithoutDuplicates = this.getItemsToAdd(arrOfPokemonsID);
        }else{
          isPokimonObjectExists = this.getItemsToAddFromObject(pokemonObj);
        }
        if (pokemonObj) {
          pokemons = [pokemonObj ];
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
        const obj = {
          isPokemon: false,
          item: `pokemon's:${res} wern't found`,
          isDisplay: false
        }
        this.taskList.push(obj);
        this.Orchestra.renderItem(this.taskList);
      }
    } else {
      this.taskList.push({ isPokemon: false, item: item, isDisplay: false });
    }
    this.taskList = this.taskList.filter(elem => { return elem !== undefined });
    this.Orchestra.renderItem(this.taskList);
  }

  getItemsToAddFromObject(pokemonObj){

    // const ArrWithoutDuplicates = this.taskList.filter(task=>{task.item!== pokemonObj})


  }
  updateDeletedTaskInArray() {
    // I init all removed tasks to undefined in Orchestra
    this.taskList = this.taskList.filter(elem => { return elem !== undefined });
  }

  sortList() {
    this.Orchestra.sortList();
  }
  clearList() {
    this.taskList = [];
    this.Orchestra.clearList(this.taskList);

  }
  getPokemonNames(item) {
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

}
export default ItemManager;


