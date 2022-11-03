class PokemonBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequest"; 
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message); 
    this.name = "PokemonBadRequestMissingID";
  }
}

class PokemonDbError extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
  }
}

class PokemonNotFoundError extends PokemonDbError {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
  }
}

export default {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
};



