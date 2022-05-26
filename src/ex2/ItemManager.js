import PokemonClinet from "./PokemonClient.js";
import Orchestra from "./orchestra.js";

 class ItemManager {
  constructor() {
    this.taskList =[];
    this.pokemonClinet = new PokemonClinet();
    this.Orchestra = new Orchestra();
  }

  async addItem(item) {
    const {isPokemon,arrOfPokemonsID} = this.isPokemon(item); 
     if(isPokemon){
      const ArrWithoutDuplicates = this.getItemsToAdd(arrOfPokemonsID);
      if (ArrWithoutDuplicates.length == 0) {
        this.taskList.push({
          isPokemon: false,
          item: "pokemon alredy existed",
          isDisplay: false
        });
        throw "pokemon alredy existed";
      } else {
        try {
          const pokemons = await this.pokemonClinet.fetchPokemon(ArrWithoutDuplicates);
          this.taskList = this.taskList.concat(
            pokemons.map((pokemon) => {
              const obj = {isPokemon: isPokemon, item: pokemon, isDisplay: false}
              this.taskList.push(obj)
            })
          );
        } catch (e) {
          this.itemsArr.push({
            isPokemon: false,
            item: "pokemon not found",
            isDisplay: false
          });
          throw "pokemon not found";
        }
      }
    } else {
      this.taskList.push({isPokemon: false, item: item, isDisplay: false});
    }
      const res = this.taskList.filter(elem => { return elem !== undefined});
      this.taskList=res;
      this.Orchestra.addItem(this.taskList);
    }

  sortList(){
    this.Orchestra.sortList();
  }
  clearList(){
    this.taskList = [];
    this.Orchestra.clearList(this.taskList);

  }
  getPokemonNames(item){
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

 
