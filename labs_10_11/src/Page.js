import React from "react";
import PokemonImage from "./PokemonImage";
import Modal from "react-bootstrap/Modal";

function Page({ pokemon, page}) {

  const [show, setShow] = React.useState(false);

  const [modalData, setModalData] = React.useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <h2>Page: {page}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <div className="pokeImage">
            <button id="PokeButton" onClick={() => {
              setModalData(p);
              handleShow();
            }}>
            <PokemonImage pokemon={p} />
            </button>
          </div>
        ))}
      </div>
      <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{modalData?.name.english}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <PokemonImage pokemon={modalData} />
                <div>
                  <p>HP: {modalData?.base.HP}</p>
                  <p>Attack: {modalData?.base.Attack}</p>
                  <p>Defense: {modalData?.base.Defense}</p>
                  <p>Sp. Attack: {modalData?.base["Sp. Attack"]}</p>
                  <p>Sp. Defense: {modalData?.base["Sp. Defense"]}</p>
                  <p>Speed: {modalData?.base.Speed}</p>
                  <br></br>
                  <p>Type: {modalData?.type.join(", ")}</p>
                </div>
              </Modal.Body>
            </Modal>
    </div>
  );
}

export default Page;

