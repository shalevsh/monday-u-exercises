class PokemonClinet {
  constructor() {}
  fetchPokemon(arr) {
    if (arr.length === 1) {
      
     return  this.getSinglePokemon(arr);
    } else return this.getMultiPokemons(arr);
  }
  async getSinglePokemon(arr) {
    const response = await fetch("https:pokeapi.co/api/v2/pokemon/" + arr[0]);
    const pokemon = await response.json();
    return [pokemon.name]
    
  }
   getMultiPokemons(arr) {

    const responses = [];
    const result = [];
 
    arr.forEach((id) => {
      const data = fetch("https:pokeapi.co/api/v2/pokemon/" + id);
      console.log(data);
      responses.push(data);
    });
        Promise.all(responses).then((res) =>Promise.all (res.map(r=>r.json())))
      .then(jsonObjects=>{ console.log(jsonObjects) })
      
      

    

  }
}

export default PokemonClinet;
