class PokemonClinet {
  constructor() {

  }
  fetchPokemon(arr) {
    const responses = []; 
    arr.forEach((id) => {
      const data = fetch("https:pokeapi.co/api/v2/pokemon/" + id);
      responses.push(data);
    });
       return Promise.all(responses).then((res) =>Promise.all (res.map(r=>r.json())));
  }
}
export default PokemonClinet;
