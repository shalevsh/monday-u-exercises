import PokemonClinet from "./PokemonClient.js";
import Orchestra from "./orchestra.js";

 class ItemManager {
  constructor() {
    this.itemsArr = [];
    this.pokemonClinet = new PokemonClinet();
    this.Orchestra = new Orchestra();
  }

  addItem(item) {
    const isPokemon = this.validation(item)
    const pokemonNames = isPokemon == true ? this.getPokemonNames(item) :this.itemsArr.push(item)
     if(pokemonNames){
    
     }
     this.Orchestra.addItem(item)
    
  }
  sortList(){
    this.Orchestra.sortList();
  }
  clearList(){
    this.Orchestra.clearList();

  }
  deleteItem(item) {
    console.log('here',item)
    const idx = this.itemsArr.findIndex((elem) => { if(elem == item)return true; });
    this.itemsArr.splice(idx, 1);
    console.log(idx,this.itemsArr)
  }

  validation(item) {
    const arr = item.split(",");
    let flag = false;
    arr.forEach((element) => {
      if (!this.isNum(element)) {
        return;
      }
      flag = true;
    });
    return flag;
  }
  getPokemonNames(item) {
    const arr = item.split(",");
    console.log('mewo',arr)
    const pokemonNames = this.pokemonClinet.fetchPokemon(arr);
    console.log('mew3',pokemonNames)
    return pokemonNames
    
    
   
  }

  isNum(val) {
    return !isNaN(val);
  }

}
export default ItemManager;

 
