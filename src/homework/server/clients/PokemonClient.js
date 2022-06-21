
import  {promises as fs } from "fs";
import axios from 'axios';
export default class PokemonClinet {
  constructor() {
  }
  fetchPokemon(arr) {
    const responses = [];
    arr.forEach((id) => {
      const data = axios.get("https://pokeapi.co/api/v2/pokemon/" + id);
      responses.push(data);
    });
    return Promise.all(responses).then((res) => (res.map(r => r.data)));
  }

  async checkByPokemonName(name) {
    let pokemonsArrList =await  this.readFromPokemonDataBaseFile();
    if(pokemonsArrList===undefined){
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
    pokemonsArrList =  response.data
    this.savePokemonList(pokemonsArrList);
    }
    
    let res = null
    for (const obj of pokemonsArrList.results) {
      if (obj.name === name.toLowerCase()) {
        const response = await axios.get(obj.url);
        const pokemonObj =  response.data;
        res = pokemonObj;
      }
    }
    return res
  }

  async savePokemonList(pokemonsArrList) {
    await fs.writeFile("./pokemonsDB.json", JSON.stringify(pokemonsArrList), err => {
      if (err) console.log("Error writing file of pokemons Data Base:", err);
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


