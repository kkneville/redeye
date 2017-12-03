var mongoose = require('mongoose');

module.exports = {
  	index: function(req, res) {
  		console.log("inside of index")
    	return res.render('index');	
	}

}

