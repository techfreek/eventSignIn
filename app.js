/*jshint node:true*/
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.VCAP_APP_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

app.use(
    	"/bower_components",
    	express.static(__dirname + '/bower_components')
    );

app.use(
    	"/node_modules",
    	express.static(__dirname + '/node_modules')
    );


// Main App Page
app.get('/', routes.index);

// MongoDB API Routes
app.get('/events/events', routes.list);
app.get('/events/:id', routes.event);
app.get('/event/detail', routes.detail);
app.get('/event/:id/edit', routes.edit);
//app.put('/events', function(){routes.createEvent});
app.post('/events', routes.createEvent);
app.post('/sign', routes.sign);
app.post('/validate', routes.validate);

//app.post('/vote', function(){routes.vote});

io.sockets.on('connection', routes.sign);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
