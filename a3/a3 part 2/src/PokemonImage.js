import React from "react";

function PokemonImage({ pokemon }) {

  const addLeadingZeros = (id) => {
    if (id < 10) {
      return `00${id}`;
    }
     if (id < 100) {
      return `0${id}`;
    }
    return id;
  };


  return (
    
    <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${addLeadingZeros(pokemon.id)}.png`} width={200} />
  )
}

export default PokemonImage;