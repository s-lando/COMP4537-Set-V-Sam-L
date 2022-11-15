class PokemonError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PokemonError';
    this.statusCode = 400;
  }
}

class PokemonBadRequest extends PokemonError {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequest";
    this.message = "Bad request to the server";
    this.statusCode = 400;
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message); 
    this.name = "PokemonBadRequestMissingID";
    this.message = "Bad request to the server, missing ID";
    this.statusCode = 400;
  }
}

class PokemonDbError extends PokemonError {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
    this.message = "Database error";
    this.statusCode = 500;
  }
}

class PokemonNotFoundError extends PokemonDbError {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
    this.message = "Pokemon not found";
    this.statusCode = 500;
  }
}

module.exports = {
  PokemonError,
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
};



