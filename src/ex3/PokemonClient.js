import fetch from 'node-fetch';
import  {promises as fs } from "fs";
export default class PokemonClinet {
  constructor() {
  }
  fetchPokemon(arr) {
    const responses = [];
    arr.forEach((id) => {
      const data = fetch("https://pokeapi.co/api/v2/pokemon/" + id);
      responses.push(data);
    });
    return Promise.all(responses).then((res) => Promise.all(res.map(r => r.json())));
  }

  async checkByPokemonName(name) {
    let pokemonsArrList =await  this.readFromPokemonDataBaseFile();
    if(pokemonsArrList===undefined){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
    pokemonsArrList = await response.json();
    this.savePokemonList(pokemonsArrList);
    }
    
    let res = null
    for (const obj of pokemonsArrList.results) {
      if (obj.name === name.toLowerCase()) {
        const response = await fetch(obj.url);
        const pokemonObj = await response.json();
        res = pokemonObj;
      }
    }
    return res
  }

  async savePokemonList(pokemonsArrList) {
    await fs.writeFile("./pokemonsDB.json", JSON.stringify(pokemonsArrList), err => {
      if (err) console.log(chalk.red("Error writing file of pokemons Data Base:", err));
    });
  }


  async readFromPokemonDataBaseFile(){
    try {
      const todoJsonFile = await fs.readFile("pokemonsDB.json");
      return JSON.parse(todoJsonFile);
    } catch (err) {
      return undefined;
    }
  }
}


