import './App.css';
import React, { useState, useEffect } from 'react';
import FilterPagination from './FilterPagination';
import TypeSearch from './TypeSearch';



function App() {


  
  const [checkedState, setCheckedState] = useState([]);

  const types = [
    "Normal",
    "Fighting",
    "Flying",
    "Poison",
    "Ground",
    "Rock",
    "Bug",
    "Ghost",
    "Steel",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Psychic",
    "Ice",
    "Dragon",
    "Dark",
    "Fairy",
  ];

  useEffect(() => {
    setCheckedState(types.map(() => false));
  }, []);

  
  return (
    <div className="App">
      <TypeSearch types={types} checkedState={checkedState} setCheckedState={setCheckedState} />
      <FilterPagination types={types} checkedState={checkedState} />
    </div>
  );
}

export default App;
