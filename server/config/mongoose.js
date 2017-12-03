var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/prototype');
mongoose.Promise = global.Promise;

var fs = require('fs');
var path = require('path');

var models_path = path.join(__dirname, './../models');

