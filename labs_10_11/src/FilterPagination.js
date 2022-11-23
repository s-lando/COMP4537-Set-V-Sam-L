import React, {useEffect, useState} from 'react';
import Page from './Page';
import Pagination from './Pagination';
import pokemon from './pokemon.json';

function FilterPagination({types, checkedState}) {

  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {

    let checked = checkedState.filter((item) => item.checked === true);
    pokemon.filter(p => {
      if (checked.length === 0) {
        setPokemons(pokemon);
      } else {
        checked.map((item) => {
          if (p.type.includes(item.name)) {
            setPokemons((prev) => [...prev, p]);
          }
        });
      }
    });
  }, [checkedState]);


  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(10);

  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = pokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const numberOfPages = Math.ceil(pokemon.length / pokemonPerPage);

  return (
    <div>
    <Page pokemon={currentPokemon} page={currentPage} />
    <Pagination n={numberOfPages} current={currentPage} setCurrent={setCurrentPage} />
    </div>
  )
}