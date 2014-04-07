// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
   db = mongoose.createConnection('localhost', 'eventssapp');
}

// Get Poll schema and model
var EventSchema = require('../models/Event.js').EventSchema;
var Event = db.model('events', EventSchema);

// Main application view
exports.index = function(req, res) {
	res.render('index');
};

// JSON API for list of polls
exports.list = function(req, res) {
	// Query Mongo for polls, just get back the question text
	Event.find({}, 'name', function(error, events) {
		res.json(events);
	});
};

// JSON API for getting a single poll
exports.event = function(req, res) {
	console.log("Event");
	// Poll ID comes in the URL
	var eventId = req.params.id;
	
	// Find the poll by its ID, use lean as we won't be changing it
	Event.findById(eventId, '', { lean: true }, function(err, _event) {
		if(_event) {
			var userVoted = false, totalAttendee = 0;

			for(v in _event.votes) {
				totalVotes++;

				if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
					userVoted = true;
					userChoice = { _id: choice._id, text: choice.text };
				}
			}

			// Attach info about user's past voting on this poll

			_event.totalVotes = totalAttendee;
		
			res.json(_event);
		} else {
			res.json({error:true});
		}
	});
};

// JSON API for creating a new poll
exports.createEvent = function(req, res) {
	console.log("CreateEvent");
	var reqBody = req.body,
	// Build up poll object to save
	eventObj = {ongoing: reqBody.open, eventname: reqBody.name, clubname: reqBody.club};
				
	// Create poll model from built up poll object
	var _event = new Event(eventObj);
	
	// Save poll to DB
	_event.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}		
	});
};

exports.vote = function(socket) {
	console.log("Vote");
	socket.on('send:vote', function(data) {
		var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
		
		Event.findById(data.event_id, function(err, _event) {
			var choice = poll.choices.id(data.choice);
			
			_event.save(function(err, doc) {
				var theDoc = { 
					uname: doc.name,
					userVoted: false, totalVotes: 0 
				};
				
				socket.emit('myvote', theDoc);
				socket.broadcast.emit('vote', theDoc);
			});			
		});
	});
};