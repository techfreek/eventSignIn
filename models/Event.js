var mongoose = require('mongoose');


// Subdocument schema for poll choices
var enameSchema = new mongoose.Schema({ eventname: 'String'});

var clubSchema = new mongoose.Schema({ clubname: 'String'});

// Document schema for polls
exports.EventSchema = new mongoose.Schema({
	ongoing: { type: String, required: true },
	eventname: { type: String, required: true },
	clubname: { type: String, required: true },
});