// Controller for the Event list
function EventListCtrl($scope, Event) {
	var tEvents;
	$scope.Events = Event.query(function() {
		angular.forEach($scope.Events, function(key, value) {
			if(key.open == false)
			{
				$scope.Events.splice(value, 1);
			} else {
				key.fullName = key.club + " " + key.name;
			}

		});
		
	});
	/*
	for(var i = 0; i<($scope.Events).length; i++)
	{
		$scope.Events[i].fullName = $scope.Events[i].club + " " + $scope.Events[i].name;
		console.log($scope.Events[i].fullName);
	}*/
	//.$scope.query = '';
}

// Controller for an individual Event
function EventItemCtrl($scope, $routeParams, socket, Sign, Event) {
	//console.log($routeParams.eventId);
	$scope.Event = Event.get({id: $routeParams.eventId});
	$scope.Event.id = $routeParams.eventId;
	$scope.voted = false;
	$scope.signature = { name: '', timestamp: '', EventID: ''};

	socket.on('signIn', function(data) {
		console.dir(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event = data;
		}
	});
	
	socket.on('signed', function(data) {
		console.log(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event.totalAttendee = data.sigs;
		}		
	});
	
	$scope.sign = function() {
		$scope.voted = true;
		var EventId = $scope.Event._id;

		$scope.signature.EventID = EventId;
		$scope.signature.timestamp = Date.now();

		var signObj = $scope.signature;

		if($scope.signature.name)

		if($scope.signature.name) {
			socket.emit('send:vote', signObj);
		} else {
			alert('You must select an option to vote for');
		}
	};
}

// Controller for creating a new Event
function EventNewCtrl($scope, $location, Event) {
	// Define an empty Event model object
	$scope.Event = {name: '', club: '', pw: 'For now, this is not encrypted. Please do not use one of your normal passwords', open: true};
	
	// Validate and save the new Event to the database
	$scope.createEvent = function() {
		// Check that an event and club were provided
		if($scope.Event.name != '') {
			if($scope.Event.club  != '') {
				var newEvent = new Event($scope.Event);
				console.log(newEvent);
				newEvent.$save(function(p, resp) {
					if(!p.error) {
						//If there is no error, redirect to main view
						$location.path('event');
						console.log("Success!");
					} 
					else {
						alert('Could not create event');
						console.log(p);
					}
					console.log(resp);
				});
			};
		};
	};
}

function EventMgmtCtrl($scope, $routeParams, $cookies, $resource, $scope) {
	var id = $routeParams.eventId;
	$scope.id = id;
	var editEvent = $resource('/events/:id', 
		{name: '@name', club: '@club', pw: '@pw', open: '@open'}, {
		details: {method: 'GET', url:'/event/detail'},
		validate: {method: 'POST', url:'/event/validate', params:{id: true, pw: true}},
		update: {method:'POST', url:'/event/:id/edit', params:{id: true, name: true, club: true, open: true}}
	});
	$scope.Event = editEvent.details({id: id}, function(res) {
		$scope.Event = res;
		//console.log("Res: " + JSON.stringify(res));
	});

	$scope.login = function() {
		var valid = false;
		var pw = $scope.password;
		editEvent.validate({id: id, pw: pw}, function(res, valid) {
			$scope.valid = res.validation;
			console.log("Valid: " + $scope.valid);
			$cookies.event = {_id: id, signedIn: true};
			console.log("Cookie: " + JSON.stringify($cookies.event));
			setTimeout(function(){$scope.$apply(); console.log("Now: " + $scope.valid)}, 10);
		});	
		setTimeout(function(){console.log("And now: " + $scope.valid)}, 100);
	};
	setTimeout(function(){console.log("And and " + $scope.valid)}, 10000);
	console.log("login: " + $scope.valid);
	//console.log("Cookie: " + JSON.stringify($cookies.event));
}

function EventViewCtrl($scope, $routeParams, $resource, $location, socket, Sign, Event) {
	$scope.id = $routeParams.eventId;
	var editEvent = $resource('/events/:id', 
		{name: '@name', club: '@club', pw: '@pw', open: '@open'}, {
		details: {method: 'GET', url:'/event/detail', params:{id:true}},
		validate: {method: 'POST', url:'/event/validate', params:{id:true, pw: true}},
		update: {method:'POST', url:'/event/:id/edit', params:{id: true, name: true, club: true, open: true}},
		attendees: {method: 'GET', url:'/event/:id/ppl', params:{id: true, pw: true}}
	});



	socket.on('sig', function(data) {
		console.log(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event.totalAttendee = data.sigs;
			$scope.attendees.push(data.user);
		}		
	});
}

function EventEditCtrl($scope, $routeParams, $resource, $location, socket, Sign, Event) {
	$scope.id = $routeParams.eventId;
	var editEvent = $resource('/events/:id', 
		{name: '@name', club: '@club', pw: '@pw', open: '@open'}, {
		details: {method: 'GET', url:'/event/detail', params:{id:true}},
		validate: {method: 'POST', url:'/event/validate', params:{id:true, pw: true}},
		update: {method:'POST', url:'/event/:id/edit', params:{id: true, name: true, club: true, open: true}}
	});
	$scope.Event = editEvent.details({id:$routeParams.eventId});
	console.log("update");
	$scope.submit = function() {
		editEvent.update({id: $scope.id, name: $scope.Event.Name, club: $scope.Event.club, open: $scope.Event.open})
	};
}