import React, {useEffect, useState} from 'react';
import Page from './Page';
import Pagination from './Pagination';
import pokemon from './pokemon.json';

function FilterPagination({types, checkedState}) {

  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    //filter pokemons by checked types

    const filteredPokemons = pokemon.filter((p) => {
      return p.type.some((t) => {
        return checkedState[types.indexOf(t)];
      });
    });

    setPokemons(filteredPokemons);


  }, [checkedState]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(3);

  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = pokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const numberOfPages = Math.ceil(pokemons.length / pokemonPerPage);

  return (
    <div>
    <Page pokemon={currentPokemon} page={currentPage} />
    <Pagination n={numberOfPages} current={currentPage} setCurrent={setCurrentPage} />
    </div>
  )
}

export default FilterPagination;