import React from "react";
import PokemonImage from "./PokemonImage";

function Page({ pokemon, page}) {
  return (
    <div>
      <h1>Page: {page}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <div key={p.id} className="bg-gray-200 rounded-lg p-4">
            <PokemonImage key={p.id} pokemon={p} />
            {/* <h2 className="text-2xl">{p.name.english}</h2>
            <p className="text-lg">{p.type.join(", ")}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;

