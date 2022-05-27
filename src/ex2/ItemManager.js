import PokemonClinet from "./PokemonClient.js";
import Orchestra from "./orchestra.js";

 class ItemManager {
  constructor() {
    this.taskList =[];
    this.pokemonClinet = new PokemonClinet();
    this.Orchestra = new Orchestra();
  }

  async addItem(item) {
    this.updateDeletedTaskInArray();
    console.log(this.taskList);
    const {isPokemon,arrOfPokemonsID} = this.isPokemon(item); 
     if(isPokemon){
      const ArrWithoutDuplicates = this.getItemsToAdd(arrOfPokemonsID);
        try {
          const pokemons = await this.pokemonClinet.fetchPokemon(ArrWithoutDuplicates);
          this.taskList = this.taskList.concat(
            pokemons.map((pokemon) => {
              const obj = {isPokemon: isPokemon, item: pokemon, isDisplay: false}
              this.taskList.push(obj)
            })
          );
        } catch (exception) {
          let res =""; 
          ArrWithoutDuplicates.forEach( elem =>{
            res += elem + " ";
          
          });
          const obj={
            isPokemon: false,
            item: `pokemon's:${res} wern't found`,
            isDisplay: false
          }
          this.taskList.push(obj);
          this.Orchestra.renderItem(this.taskList);

        }
        
      
    } else {
      this.taskList.push({isPokemon: false, item: item, isDisplay: false});
    }
      this.taskList = this.taskList.filter(elem => { return elem !== undefined});
      this.Orchestra.renderItem(this.taskList);
    }

    updateDeletedTaskInArray(){
      // I init all removed tasks to undefined in Orchestra
      this.taskList = this.taskList.filter(elem => { return elem !== undefined});
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

 
