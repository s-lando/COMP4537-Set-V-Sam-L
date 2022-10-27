class PokemonBadRequest extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "PokemonBadRequest"; // (2)
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message); // (1)
    this.name = "PokemonBadRequestMissingID"; // (2)
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



