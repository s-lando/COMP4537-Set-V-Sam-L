import React from "react";

function TypeSearch({types, checkedState, setCheckedState}) {

  const onChange = (type) => {

    const index = types.indexOf(type);

    const newCheckedState = checkedState.map((item, i) => {

      console.log(item);
      console.log(i);
        
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
      <h1> Pokemon Type Filter</h1>
    <div id={"filter"}>
      {
        types.map((type) => {

          return (
            <div key={type} className="checkbox">
              <input type="checkbox" value={type} id={type} onChange={() => { onChange(type)}} />
              <label>{type}</label>
            </div>
          );
        })
      }
    </div>
    </div>
  );

}

export default TypeSearch;