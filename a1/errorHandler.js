class PokemonBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequest";
    this.message = "Bad request to the server";
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message); 
    this.name = "PokemonBadRequestMissingID";
    this.message = "Bad request to the server, missing ID";
  }
}

class PokemonDbError extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
    this.message = "Database error";
  }
}

class PokemonNotFoundError extends PokemonDbError {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
    this.message = "Pokemon not found";
  }
}

export default {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
};



