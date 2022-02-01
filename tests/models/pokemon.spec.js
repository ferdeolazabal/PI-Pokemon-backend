const { Pokemon, conn } = require('../../src/db.js');
const { expect } = require('chai');
const {v4: uuidv4} = require('uuid');

describe('Pokemon model', () => {
  
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
    
describe('Validators', () => {
  
  beforeEach(() => Pokemon.sync({ force: true }));
  
  describe('name', () => {
    it('should throw an error if name is null', (done) => {
      Pokemon.create({})
        .then(() => done(new Error('It requires a valid name')))
        .catch(() => done());
    });
      it('should work when its a valid name', () => {
        Pokemon.create({ name: 'Pikachu' });
      });
    });
  });
});

describe("Creating Pokemons", () => {
  
  it("should work when its a valid name and type", () => {
    Pokemon.create({
      name: "sub-zero",
      types: ['fire', 'rock'],
    }).then(() => done());
  });

  it("should return the pokemon created", async () => {
    let temp = await Pokemon.create({
      id: uuidv4(),
      name: "sub-zeru",
      life: 92,
      attack: 92,
      defense: 92,
      types: ['fire', 'rock'],
    });
    expect(temp.name).to.equal( "sub-zeru" );
    expect(temp.life).to.equal( 92 );
    expect(temp.attack).to.equal( 92 );
    expect(temp.defense).to.equal( 92 );
    // expect(temp.types).to.equal( ['fire', 'rock'] );
  });
});

