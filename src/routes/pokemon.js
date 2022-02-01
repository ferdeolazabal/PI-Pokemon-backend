const router = require('express').Router();
const { getPokeById, getAllPokemons, getPokeByName } = require('../Controllers/pokemon')
const { Pokemon, Type } = require('../db')
const {v4: uuidv4} = require('uuid');


router.get('/pokemons', async (req, res, next) => {

    const { name } = req.query;
    try {
        if (!name) {
            
            const allPokemons = await getAllPokemons();
            // console.log('allPokemons', allPokemons);
            res.status(200).json(allPokemons);
        }
        else {
            const pokeByName = await getPokeByName(name);
            res.status(200).json(pokeByName);
        }
    } catch (error) {
        next(error);
    }
});


router.get('/pokemons/id/:id', async (req, res, next) => {

    const { id } = req.params;
    console.log('id', id);
    try {
        // busqueda en DB
        if ( isNaN(id) ) {

            const pokemon = await Pokemon.findByPk( id, { include: Type } ); 
            let pokeDbId = {
                id: pokemon.id,
                name: pokemon.name,
                life: pokemon.life,
                attack: pokemon.attack,
                defense: pokemon.defense,
                speed: pokemon.speed,
                height: pokemon.height,
                weight: pokemon.weight,
                img: pokemon.img,
                types: pokemon.dataValues.types.map(type => type.name)
            };
            console.log('pokemon',pokemon)
            console.log('pokeDbId',pokeDbId)
            // res.json(pokeDbId);
            res.json(pokeDbId ? pokeDbId : 'No pokemon with that ID');
        
        } else {

            const response = await getPokeById(id);
            res.json(response);
        };
        
    } catch (error) {
        // next(error);
        res.status(200).send('no pokemons with that ID !')
    };

});


router.post('/pokemons', async (req, res, next) => {

    const { name, img, life, attack, defense, speed, height, weight, types  } = req.body;

    try {

        const newPokemon = await Pokemon.create({
            id: uuidv4(),
            createdInDb: true,
            name, life, attack, defense, speed, height, weight, img
        });
        await newPokemon.setTypes(types);

		res.json( { newPokemon, types} );

    } catch (error) {
        next(error);
    };
});

module.exports = router;