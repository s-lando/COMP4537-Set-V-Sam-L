## **Note**

Routes below are based on the Heroku deployment. Hosting locally, routes are prefaced with /api/v1/

## **Get Pokemons**

Gets all pokemons after the "after" query param, lists as many specified by the "count" query param.

- **URL**

  /pokemons

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  - **count:** <br />
    **after:**

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** An array of the json pokemon

- **Serverside route:**

  ```javascript
  $app.get('/pokemons', async (req, res)
  ```

## **Get One Pokemon**

Gets one pokemon based on id param

- **URL**

  /pokemon/:id

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  - **id**: pokemon ID

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** json of the pokemon requested

- **Serverside route:**

  ```javascript
  $app.get('/pokemon/:77', async (req, res)
  ```

  ## **Create Pokemon**

Creates a new pokemon in the database

- **URL**

  /pokemon

- **Method:**

  `POST`

- **URL Params**

None

- **Data Params**

  Json body of the pokemon to be added. Must follow this Schema:

  ```javascript
  $  pokemonSchema = new Schema({
    "base": {
       "HP": Number,
        "Attack": Number,
        "Defense": Number,
        "Sp. Attack": Number,
        "Sp. Defense": Number,
        "Speed": Number
      },
      "id": {type: Number, unique: true},
      "name": {
        "english": {type: String, maxlength: 20},
        "japanese": String,
        "chinese": String,
        "french": String
      },
      "type": {type: [String], enum: possibleTypes},
  });

  ```

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** Json of the object created and a success msg

- **Serverside route:**

  ```javascript
  $app.put('/pokemon', async (req, res)
  ```

## **Get Pokemon Image URL**

Returns the URL of an image for the pokemon based on id

- **URL**

  /pokemonImage/:id

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  - **id** pokemon id

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** json containing a msg with the url to the image

- **Serverside route:**

  ```javascript
  $app.get('/pokemonImage/:id', async (req, res)
  ```

## **Upsert Pokemon**

If pokemon already exists in db, updates with new body, else creates new pokemon

- **URL**

  /pokemon/:id

- **Method:**

  `PUT`

- **URL Params**

  **Required:**

  - **id** pokemon id

- **Data Params**

  JSON body for the pokemon

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** Json for the updated/created pokemon, or Json containing an error message

- **Serverside route:**

  ```javascript
  $app.put('/pokemon/:id', async (req, res)
  ```

## **Patch a Pokemon**

Updates a portion or entire pokemon

- **URL**

  /pokemon/:id

- **Method:**

  `PATCH`

- **URL Params**

  **Required:**

  - **id** pokemon id

- **Data Params**

  json body containing what fields to update

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** json containing fields about if and how the db was modified

- **Serverside route:**

  ```javascript
  $app.patch('/pokemon/:id', async (req, res)
  ```

## **Delete Pokemon**

Removes the a specified pokemon from the db

- **URL**

  /pokemon/:id

- **Method:**

  `DELETE`

- **URL Params**

  **Required:**

  - **id** pokemon id

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** json containing fields about if the pokemon was deleted

- **Serverside route:**

  ```javascript
  $app.delete('/pokemon/:id', async (req, res)
  ```
