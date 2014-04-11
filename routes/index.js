var mongo = require('mongodb');

var Server = mongo.Server,
	DB = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var eventDB = new DB('eventDB', server, {safe:false});

eventDB.open(function(err, db) {
	if(!err) {
		//console.log("Connected to database");
		eventDB.collection('events', {strict: true}, function(err, collection) {
			if(err) {
				console.log("'Events' collection doesn't exist yet.")
			}
		});
	}
});

exports.index = function(req, res) {
	res.render('index');
};

exports.list = function (req, res) {
	console.log("Listing Events");
	eventDB.collection('events', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.event = function(req, res) {
	var id = req.params.id;
	console.log("Looking up: " + id);
	eventDB.collection('events', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.detail = function(req, res) {
	var id = req.query.id;
	console.log("req body: " + JSON.stringify(req.body));
	console.log("req params: " + JSON.stringify(req.params));
	console.log("req query: " + JSON.stringify(req.query));

	eventDB.collection('events', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);	
		});
	});
};

exports.validate = function(req, res) {
	var id = req.body.id;

	console.log("req body: " + JSON.stringify(req.body));
	console.log("req params: " + JSON.stringify(req.params));
	console.log("req query: " + JSON.stringify(req.query));
	eventDB.collection('events', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			console.log("Validation Error: " + err);
			if(item.pw === req.body.pw){
				console.log("Validated!");
				res.json({validation: true});
			} else {
				console.log("Not Validated!");
				res.json({validation: false});
			}
		});
	});
};

exports.createEvent = function (req, res) {
	var newEvent = req.body;
	console.log("Adding event" + JSON.stringify(newEvent));
	eventDB.collection('events', function(err, collection) {
		collection.insert(newEvent, {safe: true}, function(err, result) {
			if (err) {
				console.log('Error inserting' + JSON.stringify(newEvent));
				res.send({'error': 'An error has occured'});

			} else {
				console.log('Success! ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.edit = function(req, res) {
	var body = req.body;
	console.log("Looking up: " + id);
	eventDB.collection('events', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(body.id)}, {$set: {'name': body.name, 'club': body.club, 'open': body.open}}, function(err, object) {
			res.send(object);
		});
		/*collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			item.remove.pw;
			res.send(item);
		});*/
	});
};

exports.sign = function(socket) {
	socket.on('send:vote', function(data) {
		var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
		var signatures = 0;
		data.ip = ip;
		eventDB.collection('logins', function(err, collection) {
			collection.insert(data, {safe: true}, function(err, result) {
				if(err) {
					console.log("An error occured");
				} else {
					console.log(data.name + " has signed in!");
					//socket.broadcast.emit('signed', data)
				}
			});
			var tempID = data.EventID;
			collection.count({'EventID':tempID}, function(err, result) {
				signatures = result;
				socket.emit('signed', {name: data.name, sigs: signatures});
			});
			
		});
	});
};

/*Event.findById(data.event_id, function(err, _event) {
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
	});*/



/*exports.update = function(req, res) {
	var eventID = req.params.id;
	var editedEvent = req.body;
	console.log("Updating: " + eventID);
	eventDB.collection('events', function(err, collection) {
		collection.update({'_id': new BSON.ObjectID(id)}, editedEvent, {safe: true}, function(err, result) {
			if(err) {
				console.log('Error updating event: ' + err);
				res.send({'error': 'Couldn\'t update event'});
			} else {
				console.log('' + result + 'document(s) updated');
				res.send(editedEvent);
			}
		});
	});
};

*/






/*

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
	Event.events.save(_event, function(err, doc) {
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

*/