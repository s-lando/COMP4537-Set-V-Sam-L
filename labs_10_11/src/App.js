import './App.css';
import React, { useState, useEffect } from 'react';
import FilterPagination from './FilterPagination';
import TypeSearch from './TypeSearch';


function App() {

  const [checkedState, setCheckedState] = useState([]);

  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]

  
  return (
    <div className="App">
      <TypeSearch types={types} checkedState={checkedState} setCheckedState={setCheckedState} />
      <FilterPagination types={types} checkedState={checkedState} />
    </div>
  );
}

export default App;
