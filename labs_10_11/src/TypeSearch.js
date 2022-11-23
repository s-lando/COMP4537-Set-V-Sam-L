import React, { useEffect, useState } from "react";

function TypeSearch({types, checkedState, setCheckedState}) {

  const onChange = (type) => {

    const index = types.indexOf(type);

    const newCheckedState = checkedState.map((item, i) => {
        
        if (i === index) {

          return !item;

        } else {
  
          return item;
        }
      }
    );

    setCheckedState(newCheckedState);
  };

  return (
    <div>
      {
        types.map((type, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={checkedState[index]}
              onChange={() => onChange(type)}
            />
            <label>{type}</label>
          </div>
        ))
      }
    </div>
  );

    

}