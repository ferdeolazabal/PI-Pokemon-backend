/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, conn } = require('../../src/db.js');
const {v4: uuidv4} = require('uuid');

const agent = session(app);
const pokemon = {
  name: 'Pikachu',
};

describe('Pokemon routes',() => {
  
  before(() => conn.authenticate()
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
    }));
  
    beforeEach( () => Pokemon.sync({ force: true })
      .then(() => Pokemon.create(pokemon)));

  describe("GET /pokemons", async () => {

    it("should get 200", await function (){
      agent.get("/pokemons").expect(200);
    }) 
  });

describe("GET /pokemons?name='parametro'", async () => {
  
  it("debe retornar 200", await function() {
    agent.get("/pokemons?name=pikachu").expect(200)});

  });

describe("GET /pokemons/id/:id", async function () {

  it("responde con 404 cuando la página no existe", await function () {
    return agent.get("/pokemons/id/pp")
        .expect(404);
  });

  it("responde con 200 cuando la página existe", function () {
    let pokemon = Pokemon.create({
      id: uuidv4(),
      name: "cruachan",
      life: 92,
      attack: 92,
      defense: 92,
      types: ['fire', 'rock'],
    }).then(() => {
      return agent.get("/pokemons/" + pokemon.id)
            .expect(200);
    });
  });

});
});