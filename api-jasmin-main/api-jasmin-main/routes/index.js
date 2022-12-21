const router = require('express').Router();
const entitiesRouter = require('./entities');

router.use('/entities', entitiesRouter);

module.exports = router;