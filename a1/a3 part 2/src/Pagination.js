import React from 'react'

// n is the number of pages
function Pagination({ n, current, setCurrent }) {
  const pageNumbers = []
  for (let i = 1; i <= n; i++) {
    pageNumbers.push(i)
  }
  const nextPage = () => {
    if (current !== n) setCurrent(current + 1)
  }
  const prevPage = () => {
    if (current !== 1) setCurrent(current - 1)
  }



  return (
    <div>
      {(current !== 1) && (<button onClick={prevPage}>prev </button>)}

      {
        pageNumbers.forEach(number => {
          if (number < current && number > current)
            return (<>
              <button onClick={() => setCurrent(number)} className={(number === current) ? 'active' : ''}>
                {number}
              </button>
            </>)
        })
      }

      {(current !== n) && <button onClick={nextPage}>
        next
      </button>}
    </div>
  )
}

export default Pagination