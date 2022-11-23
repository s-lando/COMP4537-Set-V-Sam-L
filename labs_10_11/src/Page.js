import React from "react";
import PokemonImage from "./PokemonImage";

function Page({ pokemon, page}) {
  return (
    <div>
      <h1>Page: {page}</h1>
      {pokemon.map((pokemon) => {
        return <PokemonImage key={pokemon.id} pokemon={pokemon} />;
      })}
    </div>
  );
}

export default Page;

