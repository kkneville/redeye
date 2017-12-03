var mongoose = require('mongoose');
var games = require('../controllers/games')

module.exports = (app, req, res) => {
	
	app.get('/', games.index);

}