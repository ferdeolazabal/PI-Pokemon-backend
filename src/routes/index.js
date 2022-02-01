const router = require('express').Router();

const pokemonRoute = require('./pokemon');
const typesRoute = require('./type');


router.use('/', pokemonRoute)
router.use('/', typesRoute)


module.exports = router;