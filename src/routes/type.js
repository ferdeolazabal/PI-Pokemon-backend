const router = require('express').Router()
const { Type } = require('../db')


router.get('/types', async (req, res) => {
	
	try {
		const types = await Type.findAll();
		res.status(200).send(types);
		}
	catch(error) {
		res.status(501).send(error);
	};
});

module.exports = router;